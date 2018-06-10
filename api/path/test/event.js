//https: //docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
module.exports = {
	httpMethod: "POST",
	headers: {},
	pathParameters: {
		id: "menu/product/US.json",
		version: "drupal-" + Date.now()
	},
	body: {
		"locale=en-US&auth=anonymous": "THIS IS THE BODY TEMPLATE",
		"locale=en-US&auth=presenter": "THIS IS THE PRESENTER TEMPLATE",
		"locale=es-ES&auth=presenter": "THIS IS THE ES BODY TEMPLATE",
	},
	isBase64Encoded: false,
};
