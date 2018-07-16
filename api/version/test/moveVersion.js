//https: //docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
const fs = require("fs");

module.exports = {
	httpMethod: "POST",
	headers: {},
	pathParameters: {
		version: "1532225460001"
	},
	body: {
		id: "1532225460002",
		name: "test change"
	},
	isBase64Encoded: false,
};
