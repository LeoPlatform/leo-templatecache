//https: //docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
const fs = require("fs");

module.exports = {
	httpMethod: "POST",
	headers: {},
	pathParameters: {
		id: "templates/site_wrapper",
		version: "test"
	},
	body: {
		"locale=en_US&auth=anonymous": fs.readFileSync("./test/fixtures/html_locale=en_US&auth=anonymous"),
		"locale=en_US&auth=customer": fs.readFileSync("./test/fixtures/html_locale=en_US&auth=customer"),
		"locale=en_US&auth=presenter": fs.readFileSync("./test/fixtures/html_locale=en_US&auth=presenter"),
	},
	isBase64Encoded: false,
};
