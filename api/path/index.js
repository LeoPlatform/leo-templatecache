"use strict";
var request = require("leo-auth");
var config = require("leo-config");
const union = require("lodash.union");
var querystring = require("querystring");
const crypto = require("crypto");
const zlib = require("zlib");

const defaults = {
	locale: 'en_US',
	auth: 'anonymous'
};

const optionsOrder = ['locale', 'auth'];
const options = {
	locale: [
		'en_US',
		'es_ES',
		'es_MX',
		'en_GB',
		'fr_FR',
		'en_CA',
		'fr_CA',
		'it_IT'
	],
	auth: [
		'anonymous',
		'customer',
		'presenter'
	]
};
let fallbacks = {
	auth: {
		'customer': 'anonymous',
		'presenter': 'customer'
	},
	locale: {}
}

let firstLanguage = {};
options.locale.forEach(locale => {
	//There is no fallback for en_US other than a 404?
	if (locale == 'en_US') return;

	let [language, market] = locale.split(/\_/);
	if (!(language in firstLanguage)) {
		fallbacks.locale[locale] = "en_US";
		firstLanguage[language] = locale;
	} else {
		fallbacks.locale[locale] = firstLanguage[language];
	}
});
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
let variations = cartesian.apply(cartesian, optionsOrder.map(e => options[e])).map(v => {
	return cartesian.apply(cartesian, optionsOrder.map((e, i) => {
		let t = v[i];
		let f = [t];
		while (fallbacks[e][t]) {
			t = fallbacks[e][t];
			f.push(t);
		}
		return f;
	})).map(e => {
		let q = createOptionString({
			locale: e[0],
			auth: e[1]
		});
		return {
			q: q,
			hash: crypto.createHash('md5').update(q).digest("hex")
		};
	});
});
// console.log(fallbacks.locale);
// console.log(fallbacks.auth);
// console.log(variations);

function createOptionString(params) {
	let o = Object.assign({}, defaults, params);
	return querystring.stringify(Object.keys(o).sort((a, b) => {
		return optionsOrder.indexOf(a) - optionsOrder.indexOf(b);
	}).reduce((d, k) => {
		d[k] = o[k];
		return d;
	}, {}));
}
let templateVersionCache = null;
let template = null;
let versionCache = null;

exports.handler = async function (event, context, callback) {
	let leoaws = await config.leoaws;
	let dynamodb = leoaws.dynamodb;
	let settings = Object.assign({

	}, event);
	// let user = await request.getUser(event);
	//Categorize what they are trying to do.

	//this will throw an error if access is denied
	// await user.authorize(event, {
	// 	lrn: 'lrn:leo:botmon:::cron',
	// 	action: event.httpMethod == "POST" ? "PUTVersion" : "GetVersion"
	// });
	console.time("done");
	if (event.httpMethod == "GET") {
		async function getVersions() {
			if (!versionCache) {
				versionCache = await dynamodb.scan(config.resources.Versions);
			}
			return versionCache;
		}
		async function getTemplateVersions(id) {
			if (!templateVersionCache) {
				templateVersionCache = await dynamodb.query({
					TableName: config.resources.TemplateVersions,
					IndexName: "list",
					KeyConditionExpression: "id = :id",
					ExpressionAttributeValues: {
						":id": id
					},
					"ReturnConsumedCapacity": 'TOTAL'
				});
			}
			return templateVersionCache;
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

		if (!template) {
			template = await dynamodb.get(config.resources.TemplateVersions, {
				v: latestVersion.id,
				id: pageId
			});
			let map = {};
			Object.keys(template.map).forEach(key => {
				//In case we added new defaults, that would change the hash
				let id = createOptionString(querystring.parse(key));
				let hash = crypto.createHash('md5').update(id).digest('hex');
				map[hash] = template.map[key];
			});
			let filemaps = {};
			variations.forEach(v => {
				for (var i = 0; i < v.length; i++) {
					if (v[i].hash in map) {
						filemaps[v[0].q] = v[i].hash;
						break;
					}
				}
			});
			template.map = filemaps;
		}
		console.timeEnd("done");
		callback(null, template);
	} else if (event.httpMethod == "POST") {
		let compiled = {};

		await dynamodb.update(config.resources.Templates, event.pathParameters.id, {});
		await dynamodb.update(config.resources.Versions, event.pathParameters.version, {});

		let fileContents = {};
		let fileMap = {};
		Object.keys(event.body).map(e => {
			let id = createOptionString(querystring.parse(e));
			let hash = crypto.createHash('md5').update(id).digest('hex');
			fileMap[id] = hash;
			fileContents[hash] = event.body[e];
		});

		let gzip = zlib.createGzip();
		zlib.gzip(JSON.stringify(fileContents), async (err, buf) => {
			await dynamodb.update(config.resources.TemplateVersions, {
				id: event.pathParameters.id,
				v: event.pathParameters.version
			}, {
				files: buf.toString("base64"),
				map: fileMap
			});
			return callback();
		});
	}
};
