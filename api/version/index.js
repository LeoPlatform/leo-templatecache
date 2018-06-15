"use strict";
let config = require("leo-config").bootstrap(require("../../leo_config.js"));

exports.handler = require("leo-sdk/wrappers/resource")(async function (event, context, callback) {
	let leoaws = await config.leoaws;
	let dynamodb = leoaws.dynamodb;
	let settings = Object.assign({}, event);

	if (event.pathParameters.version) {
		let templates = await dynamodb.query({
			TableName: config.resources.TemplateVersions,
			IndexName: "v-id-index",
			KeyConditionExpression: "v = :v",
			ExpressionAttributeValues: {
				":v": event.pathParameters.version
			},
			"ReturnConsumedCapacity": 'TOTAL'
		});
		callback(null, templates);
	} else {
		let versions = await dynamodb.scan(config.resources.Versions);
		callback(null, versions);
	}

});
