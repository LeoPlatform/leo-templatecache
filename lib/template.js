const querystring = require("querystring");
const crypto = require("crypto");
const leoaws = require("leo-aws");
const config = require("leo-config");
const sdk = require("../sdk/index.js");
const zlib = require("zlib");

const variations = sdk.variations;
const createOptionString = sdk.createOptionString;

module.exports = {
	getTemplateVersion: async function (id, v) {
		let dynamodb = leoaws.dynamodb;
		let template = await dynamodb.get(config.resources.TemplateVersions, {
			v: v,
			id: id
		}, {
			default: {
				map: {}
			}
		});
		let filemaps = {};
		if (template.map) {
			let map = {};
			let locales = Object.keys(template.map).map(k => querystring.parse(k).locale).filter((e, pos, a) => a.indexOf(e) == pos);
			locales.forEach(locale => {

				let aId = createOptionString({
					auth: 'anonymous',
					locale: locale
				});
				let cId = createOptionString({
					auth: 'customer',
					locale: locale
				});
				let pId = createOptionString({
					auth: 'presenter',
					locale: locale
				});

				if (!(cId in template.map)) {
					template.map[cId] = template.map[aId];
				}
				if (!(pId in template.map)) {
					template.map[pId] = template.map[cId];
				}
			})
		}
		if (template.files) {
			template.files = JSON.parse(zlib.gunzipSync(new Buffer(template.files, 'base64')));
		} else {
			template.files = {};
		}
		return template;
	},
	createOptionString: createOptionString
}
