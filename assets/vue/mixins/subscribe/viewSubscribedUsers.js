import * as Config from "../../common/Config";

export default {
	methods: {
		viewSubscribedUsers (group) {
			if(group.members_count){
				Config.config.router.go({
					name: "subscribedUsers",
					params: {
						groupId: group.groupId
					}
				});
			}
		}
	}
};