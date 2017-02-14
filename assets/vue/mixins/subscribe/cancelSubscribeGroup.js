import * as Util from "../../common/Util";
import * as Config from "../../common/Config";

let config = Config.config;
let API = {
	cancel_subscribe_group: "groups/{{groupId}}/users/{{userId}}/"
};

export default {
	methods: {
		cancelSubscribeGroup (groupId, userId, isShowLoading = true) {
			let vm = this;
			let promiseName = "cancel-subscribe-group-" + groupId + "-" + userId;

			if(vm.isGroupOperating){
				return;
			}

			vm.isGroupOperating = true;
			isShowLoading && vm.$dispatch("show-loading", true);
			Util.abortPromise(promiseName);
			Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.cancel_subscribe_group, {
				userId,
				groupId
			}), null, "delete").done((data, content, jqXHR) => {
				if(jqXHR.status === 204){
					vm.$emit("cancel-subscribe-group");
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