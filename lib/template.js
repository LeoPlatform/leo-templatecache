const config = require("leo-config");
const querystring = require("querystring");
const crypto = require("crypto");

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

module.exports = {
	getTemplateVersion: async function (id, v) {
		let leoaws = await config.leoaws;
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
