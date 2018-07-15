"use strict";
const config = require("leo-config");

const request = require("leo-auth");
const templateLib = require("../../lib/template.js");
const zlib = require("zlib");
const querystring = require('querystring');
const crypto = require("crypto");
let leoaws = require("leo-aws");

const siteWrapper = "templates/site_wrapper";

//Known locales
let locales = {
	"us": ["en_US", "es_US"],
	"ca": ["en_CA", "fr_CA"],
	"au": ["en_AU"],
	"nz": ["en_NZ"],
	"uk": ["en_UK"],
	"mx": ["es_MX", "en_MX"],
	"de": ["de_DE", "en_DE"],
	"fr": ["fr_FR", "en_FR"],
	"es": ["es_ES", "en_ES"],
	"hk": ["zh_HK", "en_HK"],
	"it": ["it_IT", "en_IT"],
	"ie": ["en_IE"]
};

const sampleData = {
	anonymous: {},
	customer: {
		__USER_ID__: 'steve'
	},
	presenter: {
		__USER_ID__: 'leo presenter'
	}
};

exports.handler = require("leo-sdk/wrappers/resource")(async function (event, context, callback) {
	let dynamodb = leoaws.dynamodb;
	let settings = Object.assign({}, event);

	//let's send back all variations for this market and language
	let market = (event.pathParameters.market || 'US').toLowerCase();

	if (event.httpMethod == "GET") {
		let template = await templateLib.getTemplateVersion(event.pathParameters.id, event.pathParameters.version + "_" + market);
		let files = template.files;
		let variations = {
			anonymous: {},
			customer: {},
			presenter: {}
		};
		let seen = {};
		locales[market].map(locale => {
			["anonymous", "customer", "presenter"].forEach(auth => {
				let variation = templateLib.createOptionString({
					locale: locale,
					auth: auth,
				});
				let hash = template.map[variation];
				console.log(template.map, variation, hash);

				if (!(hash in seen) && hash in files) {
					seen[hash] = 1;

					let t = new Buffer(files[hash]).toString("utf-8");
					let lookup = sampleData[auth];
					t = t.replace(/(__[^\s]+__)/g, (match) => {
						return lookup[match];
					});
					variations[auth][locale] = t;
				}
			});
		});
		console.log(variations);

		// console.log(event.pathParameters.id, siteWrapper, event.queryStringParameters.showWrappers == true);
		// if (event.pathParameters.id !== siteWrapper && event.queryStringParameters.showWrappers == true) {
		// 	let wrapper = await templateLib.getTemplateVersion(siteWrapper, event.pathParameters.version);
		// 	let wrapperFiles = JSON.parse(zlib.gunzipSync(new Buffer(wrapper.files, 'base64')));

		// 	let hash = wrapper.map[variation];
		// 	let w = new Buffer(wrapperFiles[hash]).toString("utf-8");
		// 	t = w.replace("__CONTENT__", t);
		// }

		zlib.gzip(JSON.stringify(variations), (err, gzip) => {
			callback(null, {
				statusCode: 200,
				headers: {
					'Content-Type': 'application/json',
					'Content-Encoding': 'gzip'
				},
				body: gzip.toString("base64"),
				isBase64Encoded: true
			});
		});
	} else if (event.httpMethod == "POST") {
		let compiled = {};

		let fileContents = {};
		let fileMap = {};
		Object.keys(event.body).map(auth => {
			Object.keys(event.body[auth]).map(locale => {
				let id = templateLib.createOptionString({
					auth,
					locale
				});
				let hash = crypto.createHash('md5').update(id).digest('hex');
				fileMap[id] = hash;
				fileContents[hash] = event.body[auth][locale];
			});
		});

		let gzip = zlib.createGzip();
		zlib.gzip(JSON.stringify(fileContents), async (err, buf) => {
			await dynamodb.update(config.resources.TemplateVersions, {
				id: event.pathParameters.id,
				v: event.pathParameters.version + "_" + market
			}, {
				files: buf.toString("base64"),
				map: fileMap
			});
			return callback();
		});
	}

});
