"use strict";
var config = require("leo-config");

exports.handler = async function (event, context, callback) {
	let leoaws = await config.leoaws;
	let dynamodb = leoaws.dynamodb;
	let settings = Object.assign({}, event);

	let versions = await dynamodb.scan(config.resources.Versions);
	callback(null, versions);
};
