//https: //docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
module.exports = {
	httpMethod: "POST",
	headers: {},
	pathParameters: {
		id: "steve"
	},
	body: [{
		id: "menu/product/US.json",
		version: "drupal-16",
		bucket: "starbucket",
		entries: {
			"language=en&market=US&auth=anonymous&state=draft": "THIS IS THE BODY TEMPLATE",
			"language=en&market=US": "THIS IS THE NON DRAFT BODY TEMPLATE",
		}
	}, {
		id: "menu/product/US.json",
		version: "drupal-15",
		bucket: "starbucket",
		entries: {
			"language=en&market=US&auth=anonymous&state=draft": "THIS IS THE LATER VERSION OF THE BODY TEMPLATE",
			"language=en&market=US": "THIS IS THE LATER VERSION OF THE NON DRAFT BODY TEMPLATE",
		}
	}],
	isBase64Encoded: false,
};
