let cf = require("leo-aws/utils/cloudformation.js")();
module.exports = cf
	.add(cf.dynamodb.table("Templates", {
		id: 'S',
		version: 'S',
		autoscale: true,
		throughput: {
			read: 200,
			write: 5
		}
	}, {
		version: {
			version: 'S',
			id: 'S',
			autoscale: true,
			throughput: {
				read: 5,
				write: 5
			}
		}
	})).add(cf.dynamodb.table("Versions", {
		id: 'S',
		release_date: 'S',
		throughput: {
			read: 1,
			write: 1
		}
	}));
