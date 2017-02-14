import * as Util from "../../common/Util";
import * as Config from "../../common/Config";

let config = Config.config;
let API = {
	subscribe_group: "groups/{{groupId}}/users/{{userId}}/"
};

export default {
	methods: {
		subscribeGroup (groupId, userId, isShowLoading = true) {
			let vm = this;
			let promiseName = "subscribe-group-" + groupId + "-" + userId;

			if(vm.isGroupOperating){
				return;
			}

			vm.isGroupOperating = true;
			isShowLoading && vm.$dispatch("show-loading", true);

			Util.abortPromise(promiseName);
			Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.subscribe_group, {
				userId,
				groupId
			}), null, "post").done((data, content, jqXHR) => {
				if(jqXHR.status === 204){
					if(vm.isFollowed){
						vm.$dispatch("show-pop-tip", "已经订阅");
						vm.isSubscribed = true;
						vm.isUnSubscribed = false;
						vm.group.members_count += 1;
					}else{
						Config.config.router.go({
							name: "subscribeSuccess"
						});
					}
				}
			}).fail((jqXHR, textStatus) => {
				if(jqXHR.status === 0){
					vm.$dispatch("show-pop-tip", "网络未连接", "icon-star-wars");					
				}				
			}).always(() => {
				vm.isGroupOperating = false;
				Util.promiseCollection[promiseName] = null;
				isShowLoading && vm.$dispatch("show-loading", false);
			});
		}
	}
};