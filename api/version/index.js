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

			let isUpdate = !!event.pathParameters.version;
			if (isUpdate) {
				let oldVersion = parseInt(event.pathParameters.version);
				let newVersion = parseInt(event.body.id);

				let version = await dynamodb.get(config.resources.Versions, oldVersion);

				//Foreach market, go and change their ids (i.e. put and delete)
				let markets = version.markets;

				let batchWrites = [];
				let batchDeletes = [];
				(await Promise.all(markets.map(m => dynamodb.query({
					TableName: config.resources.TemplateVersions,
					KeyConditionExpression: "v = :v",
					ExpressionAttributeValues: {
						":v": event.pathParameters.version + "_" + m.toLowerCase()
					}
				})))).forEach(templates => {
					templates.forEach(t => {
						batchDeletes.push({
							DeleteRequest: {
								Key: {
									v: t.v,
									id: t.id
								}
							}
						});
						t.v = t.v.replace(oldVersion, newVersion);
						batchWrites.push({
							PutRequest: {
								Item: t
							}
						})
					});
				});

				version.id = parseInt(event.body.id) || version.id;
				version.name = event.body.name || version.name;

				console.log(JSON.stringify(batchWrites, null, 2));
				console.log(version);

				let results = await Promise.all([
					dynamodb.batchTableWrite(config.resources.TemplateVersions, batchWrites),
					dynamodb.batchTableWrite(config.resources.Versions, [{
						PutRequest: {
							Item: version
						}
					}])
				]);
				console.log(results);

				results = await Promise.all([
					dynamodb.batchTableWrite(config.resources.TemplateVersions, batchDeletes),
					dynamodb.batchTableWrite(config.resources.Versions, [{
						DeleteRequest: {
							Key: {
								id: oldVersion
							}
						}
					}])
				]);
				console.log(results);
			} else {
				let something = await dynamodb.put(config.resources.Versions, parseInt(event.body.timestamp), {
					name: event.body.name,
					markets: [event.pathParameters.market.toLowerCase()]
				});
				console.log(something);
			}
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
