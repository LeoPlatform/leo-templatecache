'use strict';
const crypto = require("crypto");
const url = require("url");
const zlib = require("zlib");
const util = require("util");
const querystring = require("querystring");
const https = require('http');
const cache = require("leo-cache");

const defaults = {
	locale: 'en_US',
	auth: 'anonymous'
};

const optionsOrder = ['locale', 'auth'];
const options = {
	locale: [
		'en_US',
		'it_US',
		'es_ES',
		'es_MX',
		'en_GB',
		'fr_FR',
		'en_CA',
		'fr_CA',
		'it_IT'
	],
	auth: [
		'anonymous',
		'customer',
		'presenter'
	]
};
let fallbacks = {
	auth: {
		'customer': 'anonymous',
		'presenter': 'customer'
	},
	locale: {}
}

let firstLanguage = {};
options.locale.forEach(locale => {
	//There is no fallback for en_US other than a 404?
	if (locale == 'en_US') return;

	let [language, market] = locale.split(/\_/);
	if (!(language in firstLanguage)) {
		fallbacks.locale[locale] = "en_US";
		firstLanguage[language] = locale;
	} else {
		fallbacks.locale[locale] = firstLanguage[language];
	}
});

function createOptionString(params) {
	for (var key in params) {
		if (!params[key]) {
			delete params[key];
		}
	}

	let o = Object.assign({}, defaults, params);
	return querystring.stringify(Object.keys(o).sort((a, b) => {
		return optionsOrder.indexOf(a) - optionsOrder.indexOf(b);
	}).reduce((d, k) => {
		d[k] = o[k];
		return d;
	}, {}));
}

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
let variations = cartesian.apply(cartesian, optionsOrder.map(e => options[e])).map(v => {
	return cartesian.apply(cartesian, optionsOrder.map((e, i) => {
		let t = v[i];
		let f = [t];
		while (fallbacks[e][t]) {
			t = fallbacks[e][t];
			f.push(t);
		}
		return f;
	})).map(e => {
		let q = createOptionString({
			locale: e[0],
			auth: e[1]
		});
		return {
			q: q,
			hash: crypto.createHash('md5').update(q).digest("hex")
		};
	});
});

module.exports = function (host, opts = {}) {
	Object.assign({
		expiration: 1 * 60 * 1000
	}, opts);

	const connection = {
		get: function (path, isJSON = false) {
			return new Promise((resolve, reject) => {
				let req = https.request({
					hostname: host,
					path: path,
					method: 'GET'
				}, res => {
					let result = '';
					res.on('data', d => {
						result += d;
					});
					res.on('end', () => {
						if (isJSON) {
							resolve(JSON.parse(result));
						} else {
							resolve(result);
						}
					});
				});
				req.on('error', e => reject(e));
				req.end();
			});
		}
	};

	return {
		fetch: async function (u) {
			let {
				pathname,
				query
			} = url.parse(u);
			let data = await cache.get("STARBUCKPAGES_" + pathname, async () => {
				let r = await connection.get("/module/api/template/" + encodeURIComponent(pathname), true);
				console.log("Fetching Content for " + pathname);
				return {
					map: r.map,
					files: JSON.parse(await util.promisify(zlib.gunzip)(new Buffer(r.files, 'base64')))
				};
			}, opts.expiration);

			let requestedVariation = createOptionString(querystring.parse(query));
			let hash = data.map[requestedVariation];
			return new Buffer(data.files[hash]).toString('utf8');
		}
	};
}
module.exports.createOptionString = createOptionString;
module.exports.variations = variations;
