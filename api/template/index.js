"use strict";
// var request = require("leo-auth");
let config = require("leo-config");

let leoaws = require("leo-aws");
const cache = require("leo-cache");

const union = require("lodash.union");
const crypto = require("crypto");

var querystring = require("querystring");
const zlib = require("zlib");
const moment = require("moment");

const templateLib = require("../../lib/template.js");

exports.handler = require("leo-sdk/wrappers/resource")(async (event, context, callback) => {
	let dynamodb = leoaws.dynamodb;
	// let user = await request.getUser(event);
	//Categorize what they are trying to do.

	//this will throw an error if access is denied
	// await user.authorize(event, {
	// 	lrn: 'lrn:leo:botmon:::cron',
	// 	action: event.httpMethod == "POST" ? "PUTVersion" : "GetVersion"
	// });
	console.time("done");
	let pageId = event.pathParameters.id;
	let asOf = event.queryStringParameters.asOf ? moment(event.queryStringParameters.asOf).valueOf() : moment.now();

	//Add one millisecond so that we get all markets schedule to go at this timestamp
	asOf += 1;
	let templateVersions = await cache.get(`TEMPLATE_VERSIONS_${pageId}`, () => dynamodb.query({
		TableName: config.resources.TemplateVersions,
		IndexName: "list",
		KeyConditionExpression: "id = :id",
		ExpressionAttributeValues: {
			":id": pageId
		},
		ScanIndexForward: false,
		"ReturnConsumedCapacity": 'TOTAL'
	}));
	console.log("versions", templateVersions);
	//lets figure out which versions should go out, one per each market
	let versions = {};
	templateVersions.forEach(e => {
		let market = e.v.split(/_/, 2).slice(1).join("_");
		if (!(market in versions)) {
			versions[market] = e.v;
		}
	});
	let templates = await Promise.all(Object.values(versions).map(version => {
		return cache.get(`TEMPLATE_${pageId}_${version}`, () => templateLib.getTemplateVersion(pageId, version), 1 * 24 * 60 * 60 * 1000)
	}));
	let template = templates.reduce((a, d) => {
		Object.assign(a.map, d.map);
		Object.assign(a.files, d.files);
		return a;
	}, {
		map: {},
		files: {}
	});
	let gzip = zlib.createGzip();
	zlib.gzip(JSON.stringify(template.files), async (err, buf) => {
		template.files = buf.toString("base64");
		console.timeEnd("done");
		callback(null, template);
	});
});
