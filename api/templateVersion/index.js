"use strict";
require("leo-config").bootstrap(require("../../leo_config.js"));

const request = require("leo-auth");
const templateLib = require("../../lib/template.js");
const zlib = require("zlib");
const querystring = require('querystring');

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
	anonymous: {

	},
	customer: {
		__USER_ID__: 'steve'
	},
	presenter: {
		__USER_ID__: 'leo presenter'
	}
};

exports.handler = require("leo-sdk/wrappers/resource")(async function (event, context, callback) {
	let settings = Object.assign({}, event);

	let template = await templateLib.getTemplateVersion(event.pathParameters.id, event.pathParameters.version);

	let files = JSON.parse(zlib.gunzipSync(new Buffer(template.files, 'base64')));

	//let's send back all variations for this market and language
	let market = (event.queryStringParameters.market || 'US').toLowerCase();

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

});
