"use strict";
require("leo-config").bootstrap(require("../../leo_config.js"));

const request = require("leo-auth");
const templateLib = require("../../lib/template.js");
const zlib = require("zlib");
const querystring = require('querystring');

const siteWrapper = "templates/site_wrapper";

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

	let variation = templateLib.createOptionString({
		locale: event.queryStringParameters.locale,
		auth: event.queryStringParameters.auth,
	});
	console.log(variation);
	console.log(template.map);
	let hash = template.map[variation];
	let authType = querystring.parse(variation).auth;
	console.log(hash);
	let t = new Buffer(files[hash]).toString("utf-8");

	event.queryStringParameters.showWrappers = true;
	console.log(event.pathParameters.id, siteWrapper, event.queryStringParameters.showWrappers == true);
	if (event.pathParameters.id !== siteWrapper && event.queryStringParameters.showWrappers == true) {
		let wrapper = await templateLib.getTemplateVersion(siteWrapper, event.pathParameters.version);
		let wrapperFiles = JSON.parse(zlib.gunzipSync(new Buffer(wrapper.files, 'base64')));

		let hash = wrapper.map[variation];
		let w = new Buffer(wrapperFiles[hash]).toString("utf-8");
		t = w.replace("__CONTENT__", t);
	}
	console.log("HOWDY");
	let lookup = sampleData[authType];
	t = t.replace(/(__[^\s]+__)/g, (match) => {
		return lookup[match];
	});
	callback(null, t);
});
