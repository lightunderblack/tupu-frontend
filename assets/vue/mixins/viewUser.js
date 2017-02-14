import * as Config from "../common/Config";

export default {
	methods: {
		viewUser (userId) {
			Config.config.router.go({
				name: "userView",
				params: {
					userId: userId
				}
			});			
		}
	}
};