"use strict";
let config = require("leo-config");
var request = require("leo-auth")(require("../leo_auth.js"));
var leoaws = require("leo-aws");

//If I want to get info from DynamoDB instead
//var request = require("leo-auth")();

exports.handler = require("leo-sdk/wrappers/resource")(async function (event, context, callback) {
	let dynamodb = leoaws.dynamodb;
	let settings = Object.assign({}, event);

	if (event.httpMethod == "POST") {
		return request.authorize(event, {
			lrn: "versions",
			// action: "create"
			action: "view"
		}).then(async user => {
			let something = await dynamodb.put(config.resources.Versions, parseInt(event.body.timestamp), {
				name: event.body.name,
				markets: [event.pathParameters.market.toLowerCase()]
			});
			console.log(something);
		});
	} else {
		return request.authorize(event, {
			lrn: "versions",
			action: "view"
		}).then(async user => {
			if (event.pathParameters.version) {
				let templates = await dynamodb.query({
					TableName: config.resources.TemplateVersions,
					IndexName: "versions",
					KeyConditionExpression: "v = :v",
					ExpressionAttributeValues: {
						":v": event.pathParameters.version + "_" + event.pathParameters.market.toLowerCase()
					},
					"ReturnConsumedCapacity": 'TOTAL'
				});
				['wrapper_site_main', 'index', 'kudos', 'some other page'].forEach(page => {
					if (!templates.find(e => e.id == page)) {
						templates.push({
							id: page,
							v: null
						})
					}
				});
				callback(null, templates);
			} else {
				let versions = await dynamodb.scan({
					TableName: config.resources.Versions,
					FilterExpression: "contains(markets, :market)",
					ExpressionAttributeValues: {
						':market': event.pathParameters.market.toLowerCase(),
					}
				});
				callback(null, versions);
			}
		});
	}
});
