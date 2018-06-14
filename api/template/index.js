"use strict";
// var request = require("leo-auth");
let config = require("leo-config").bootstrap(require("../../leo_config.js"));

console.log(config);

const union = require("lodash.union");
var querystring = require("querystring");
const crypto = require("crypto");
const zlib = require("zlib");

const templateLib = require("../../lib/template.js");
// console.log(fallbacks.locale);
// console.log(fallbacks.auth);
// console.log(variations);

let templateVersionCache = null;
let template = null;
let versionCache = null;

exports.handler = require("leo-sdk/wrappers/resource")(async (event, context, callback) => {
	console.log(config);
	let leoaws = await config.leoaws;
	// let dynamodb = leoaws.dynamodb;
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
			template = templateLib.getTemplateVersion(pageId, latestVersion.id);
		}
		console.timeEnd("done");
		callback(null, template);
	} else if (event.httpMethod == "POST") {
		let compiled = {};

		await dynamodb.update(config.resources.Templates, event.pathParameters.id, {});
		await dynamodb.update(config.resources.Versions, event.pathParameters.version, {});

		let fileContents = {};
		let fileMap = {};

		if (Buffer.isBuffer(event.body)) {
			event.body = JSON.parse(zlib.gunzipSync(event.body));
		}

		Object.keys(event.body).map(e => {
			let id = templateLib.createOptionString(querystring.parse(e));
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
});
