'use strict';
const leoaws = require("leo-aws");
module.exports = {
	publish: function (env) {
		return [{
				leoaws: leoaws({
					profile: 'default',
					region: 'us-west-2'
				}),
				public: false,
				static: {
					s3: "s3://leomicroservices-leos3bucket-10v1vi32gpjy1/leo_template_cache",
					cloudfront: ""
				},
				stack: env + "LeoTemplateCache"
			}, //{
			// 	leoaws: leoaws({
			// 		profile: 'default',
			// 		region: 'us-east-1'
			// 	}),
			// 	public: false,
			// 	static: {
			// 		s3: "s3://leomicroservices-leos3bucket-10v1vi32gpjy1/leo_template_cache",
			// 		cloudfront: ""
			// 	},
			// 	stack: this.env + "LeoTemplateCache"
			// }
		];
	},
	test: {
		"personas": {
			"default": {
				"identity": {
					"source-ip": "67.163.78.93"
				}
			}
		},
		defaultPersona: 'default'
	}
};
