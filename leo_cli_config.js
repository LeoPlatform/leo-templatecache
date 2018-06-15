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
					s3: "s3://leomicroservices-leos3bucket-10v1vi32gpjy1/leo_templatecache",
					cloudfront: "https://dl3oo5x3a6dzh.cloudfront.net/",
					cognito_id: "us-west-2:aa1428e4-3b13-4dc2-ac73-e2f8c9e5a3b4",
					cognito_region: "us-west-2",
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
