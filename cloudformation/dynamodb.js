let cf = require("leo-aws/utils/cloudformation.js")();

module.exports = cf.add(cf.dynamodb.table("Templates", {
		id: 'S',
		autoscale: true,
		throughput: {
			read: 5,
			write: 5
		}
	}))
	.add(cf.dynamodb.table("TemplateVersions", {
		v: 'S',
		id: 'S',
		autoscale: true,
		throughput: {
			read: 5,
			write: 5
		}
	}, {
		list: {
			id: 'S',
			v: 'S',
			projection: 'KEYS_ONLY',
			autoscale: true,
			throughput: {
				read: 200,
				write: 5
			}
		},
		versions: {
			v: 'S',
			id: 'S',
			projection: 'KEYS_ONLY',
			autoscale: true,
			throughput: {
				read: 200,
				write: 5
			}
		}
	})).add(cf.dynamodb.table("Versions", {
		id: 'S',
		throughput: {
			read: 1,
			write: 1
		}
	}));
