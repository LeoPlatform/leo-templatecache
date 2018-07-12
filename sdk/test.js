const sdk = require("./")("localhost", {
	expiration: 1000
});

let test = async function () {
	let result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=customer");
	console.log("customer", result.length);
	result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=presenter");
	console.log("presenter", result.length);
	result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=anonymous");
	console.log("anonymous", result.length);
	await (new Promise(resolve => {
		setTimeout(resolve, 1000);
	}));
	result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=customer");
	console.log("customer", result.length);
	result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=anonymous");
	console.log("anonymous", result.length);
	await (new Promise(resolve => {
		setTimeout(resolve, 1000);
	}));
	result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=customer");
	console.log("customer", result.length);
	result = await sdk.fetch("templates/site_wrapper?locale=en_US&auth=anonymous");
	console.log("anonymous", result.length);
}

test();
