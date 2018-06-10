"use strict";
var request = require("leo-auth");
var config = require("leo-config");
const union = require("lodash.union");
var querystring = require("querystring");

const defaults = {
	locale: 'en-US',
	auth: 'anonymous'
};

const optionsOrder = ['locale', 'auth'];
const options = {
	locale: [
		'en-US',
		'es-ES',
		'es-MX',
		'en-GB',
		'fr-FR',
		'en-CA',
		'fr-CA',
		'it-IT'
	],
	auth: [
		'anonymous',
		'customer',
		'presenter'
	]
};
let authFallbacks = {
	'customer': 'anonymous',
	'presenter': 'customer'
}
let languageFallbacks = {};
let firstLanguage = {};
options.locale.forEach(locale => {
	//There is no fallback for en-US other than a 404?
	if (locale == 'en-US') return;

	let [language, market] = locale.split(/-/);
	if (!(language in firstLanguage)) {
		languageFallbacks[locale] = "en-US";
		firstLanguage[language] = locale;
	} else {
		languageFallbacks[locale] = firstLanguage[language];
	}
});
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
let variations = cartesian.apply(cartesian, optionsOrder.map(e => options[e])).map(e => {
	return {
		locale: e[0],
		auth: e[1]
	};
});

console.log(languageFallbacks);
console.log(authFallbacks);
console.log(variations);

function createOptionString(params) {
	let o = Object.assign({}, defaults, params);
	return Object.keys(o).sort((a, b) => {
		return optionsOrder.indexOf(a) - optionsOrder.indexOf(b);
	}).filter(k => {
		return true;
	}).reduce((d, k) => {
		d[k] = o[k];
		return d;
	}, {});
}

exports.handler = async function (event, context, callback) {
	let leoaws = await config.leoaws;
	let dynamodb = leoaws.dynamodb;
	let settings = Object.assign({

	}, event);
	let user = await request.getUser(event);
	//Categorize what they are trying to do.

	//this will throw an error if access is denied
	await user.authorize(event, {
		lrn: 'lrn:leo:botmon:::cron',
		action: event.httpMethod == "POST" ? "PUTVersion" : "GetVersion"
	});
	console.time("done");
	if (event.httpMethod == "GET") {
		async function getVersions() {
			return dynamodb.scan(config.resources.Versions);
		}
		async function getTemplateVersions(id) {
			return dynamodb.query({
				TableName: config.resources.TemplateVersions,
				IndexName: "list",
				KeyConditionExpression: "id = :id",
				ExpressionAttributeValues: {
					":id": id
				},
				"ReturnConsumedCapacity": 'TOTAL'
			});
		}
		let pageId = event.pathParameters.id;
		let [versions, templateVersions] = await Promise.all([getVersions(), getTemplateVersions(pageId)]);

		let availableVersions = templateVersions.reduce((a, e) => {
			a[e.v] = true;
			return a;
		}, {});

		//Only ones that are schedule for release
		versions = versions.filter(v => v.ts).sort((a, b) => {
			return b.ts - a.ts;
		});
		let latestVersion = null;
		for (let i = 0; i < versions.length; i++) {
			if (availableVersions[versions[i].id]) {
				latestVersion = versions[i];
				break;
			}
		}

		if (!latestVersion) {
			callback(null, {
				statusCode: 404,
				headers: {
					'Content-Type': 'text/html'
				},
				body: "Template Not Found"
			});
		}
		let template = await dynamodb.get(config.resources.TemplateVersions, {
			v: latestVersion.id,
			id: pageId
		});

		console.log("OPTION STRING", createOptionString({
			auth: 'anonymous',
			locale: 'en-US'
		}));

		console.timeEnd("done");
		callback(null, template);
	} else if (event.httpMethod == "POST") {
		let compiled = {};

		await dynamodb.update(config.resources.Templates, event.pathParameters.id, {});
		await dynamodb.update(config.resources.Versions, event.pathParameters.version, {});

		let entries = Object.keys(event.body).map(e => {
			let id = createOptionString(querystring.parse(e));
			return {
				id: id,
				b: event.body[e]
			};
		}).reduce((d, k) => {
			d[k.id] = k.b;
			return d;
		}, {});

		await dynamodb.update(config.resources.TemplateVersions, {
			id: event.pathParameters.id,
			v: event.pathParameters.version
		}, {
			files: entries
		});
		return callback();
	}
};
