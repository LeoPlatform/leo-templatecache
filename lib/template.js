const querystring = require("querystring");
const crypto = require("crypto");
const leoaws = require("leo-aws");
const config = require("leo-config");
const sdk = require("../sdk/index.js");

const variations = sdk.variations;
const createOptionString = sdk.createOptionString;

module.exports = {
	getTemplateVersion: async function (id, v) {
		let dynamodb = leoaws.dynamodb;
		let template = await dynamodb.get(config.resources.TemplateVersions, {
			v: v,
			id: id
		});
		let map = {};
		Object.keys(template.map).forEach(key => {
			//In case we added new defaults, that would change the hash
			let id = createOptionString(querystring.parse(key));
			let hash = crypto.createHash('md5').update(id).digest('hex');
			map[hash] = template.map[key];
		});
		let filemaps = {};
		variations.forEach(v => {
			for (var i = 0; i < v.length; i++) {
				if (v[i].hash in map) {
					filemaps[v[0].q] = v[i].hash;
					break;
				}
			}
		});
		template.map = filemaps;
		return template;
	},
	createOptionString: createOptionString
}
