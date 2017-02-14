import $ from "jquery";

import * as Util from "../../common/Util";

const API = {
	posts_report: "posts/{{postId}}/flags/"
};

export default {
	methods: {
		//举报照片
		reportPhoto (postId, isShowLoading = false) {
			let vm = this;
			let promiseName = "posts-report-" + postId;

			if(vm.isPhotoOperating){
				return;
			}

			vm.isPhotoOperating = true;
			isShowLoading && vm.$dispatch("show-loading", true);

			Util.abortPromise(promiseName);
			Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.posts_report, {
				postId
			}), null, "post").done((data, content, jqXHR) => {
				if(jqXHR.status === 204){
					vm.$dispatch("show-pop-tip", "已经举报");
				}
			}).fail((jqXHR, textStatus) => {
				if(jqXHR.status === 0){
					vm.$dispatch("show-pop-tip", "网络未连接", "icon-star-wars");
				}				
			}).always(() => {
				vm.isPhotoOperating = false;
				vm.isShowToolMoreMenu = false;
				Util.promiseCollection[promiseName] = vm = null;
				isShowLoading && vm.$dispatch("show-loading", false);
			});						
		}
	}
};