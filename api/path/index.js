"use strict";
var request = require("leo-auth");
var config = require("leo-config");
const union = require("lodash.union");
var querystring = require("querystring");

const defaults = {
	market: 'US',
	language: 'en',
	auth: 'anonymous',
	state: 'published'
};

exports.handler = async function (event, context, callback) {
	let leoaws = await config.leoaws;

	let user = await request.getUser(event);
	//Categorize what they are trying to do.

	//this will throw an error if access is denied
	await user.authorize(event, {
		lrn: 'lrn:leo:botmon:::cron',
		action: event.httpMethod == "POST" ? "PUTVersion" : "GetVersion"
	});

	let compiled = {};
	event.body.forEach(entry => {
		let id = entry.id + "-" + entry.version;

		if (!(id in compiled)) {
			compiled[id] = {
				id: entry.id,
				version: entry.version,
				files: []
			};
		}
		let e = compiled[id];
		e.files = Object.keys(entry.entries).map(e => {
			let o = Object.assign({}, defaults, querystring.parse(e));
			let params = Object.keys(o).sort().filter(k => {
				if (o[k] === defaults[k]) {
					return false;
				}
				return true;
			}).reduce((d, k) => {
				console.log(d, k);
				d[k] = o[k];
				return d;
			}, {});

			if (!Object.keys(params).length) {
				return '';
			} else {
				return querystring.stringify(params);
			}
		});
	});

	let dynamodb = leoaws.dynamodb;
	let ids = Object.keys(compiled).map(k => {
		return {
			id: compiled[k].id,
			version: compiled[k].version
		}
	});
	let entries = await dynamodb.batchGetTable(config.resources.Templates, ids);

	entries.forEach(e => {
		let id = e.id + "-" + e.version;
		if (id in compiled) {
			console.log(compiled[id]);
			compiled[id].files = union([], e.files, compiled[id].files)
		}
	});

	let stream = dynamodb.writeToTableInChunks(config.resources.Templates);
	let saves = Object.keys(compiled).forEach(k => stream.put(compiled[k]));

	stream.end((err) => {
		callback(err);
	});
};
