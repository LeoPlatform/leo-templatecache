module.exports = {
	/**
	 * All actions will be prefixed with this domain, unless they contain a :
	 **/
	actions: 'templateCache',
	/**
	 * All resources belong to this resource group, unless they start with lrn
	 **/
	resource: 'lrn:leo:templateCache',
	/**
	 * Map identities to the policies that they 
	 **/
	identities: {
		'*': ['guest_policy'],
		'role/admin': ['guest_policy', 'admin_policy'],
		'user/123413': ['custom_policy']
	},
	/**
	 * Define the policies that grant or deny access 
	 **/
	policies: {
		//guests can only do view actions
		'guest_policy': [{
			Effect: "Allow",
			Action: "view*",
			Resource: "*",
			Condition: {
				IpAddress: {
					"aws:sourceIp": ["127.0.0.1", "67.207.40.96", "67.163.78.93", "97.117.9.242"]
				}
			}
		}],
		//admins can do anything
		'admin_policy': [{
			Effect: "Allow",
			Action: "*",
			Resource: "*"
		}],
		//This user is forbidden from doing anything
		'custom_policy': [{
			Effect: "Deny",
			Action: "*",
			Resource: "*"
		}]
	}
};
