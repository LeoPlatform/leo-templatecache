'use strict';

module.exports = {
	/**defaults applied to every system**/
	_global: {
		ui: {
			staticAssets: "https://dl3oo5x3a6dzh.cloudfront.net/leo_templatecache",
			cognito: {
				id: "us-west-2:aa1428e4-3b13-4dc2-ac73-e2f8c9e5a3b4"
			},
			region: "us-west-2"
		}
	},
	dev: {
		resources: {
			Templates: 'devLeoTemplateCache-Templates-R8ZA5K903VCC',
			TemplateVersions: 'devLeoTemplateCache-TemplateVersions-3D01R5P9LF3H',
			Versions: 'devLeoTemplateCache-Versions-DUX73NQY4LWP'
		},
		"leosdk": {
			"Region": "us-west-2",
			"LeoArchive": "DevBus-LeoArchive-EV40AV12VN7Y",
			"LeoCron": "DevBus-LeoCron-1FLNC9Z5KSB72",
			"LeoEvent": "DevBus-LeoEvent-15BW5AWF2WDL",
			"LeoFirehoseStream": "DevBus-LeoFirehoseStream-WLRD5KQ5ISSP",
			"LeoKinesisStream": "DevBus-LeoKinesisStream-1LGSWLTEDERND",
			"LeoS3": "devbus-leos3-1vgbqr50913nz",
			"LeoSettings": "DevBus-LeoSettings-14HODE41JWL2O",
			"LeoStream": "DevBus-LeoStream-UY635GZGFIUQ",
			"LeoSystem": "DevBus-LeoSystem-AHQC22IPM23A"
		},
		"leoauth": {
			"Region": "us-west-2",
			"LeoAuth": "DevAuth-LeoAuth-LOG79AKRRTFR",
			"LeoAuthIdentity": "DevAuth-LeoAuthIdentity-1OVY6KPB8ZAWN",
			"LeoAuthPolicy": "DevAuth-LeoAuthPolicy-1KGQH0ER37AAP",
			"LeoAuthUser": "DevAuth-LeoAuthUser-VH4EUCCJAUJM"
		}
	},
	/**overrides on every system when running locally**/
	_local: {
		leoaws: {
			profile: 'default',
			region: 'us-west-2'
		}
	}
};
