import * as Util from "../../common/Util";

const API = {
	posts_delete: "posts/{{postId}}/"
};

export default {
	methods: {
		//删除图片
		deletePhoto (postId, isShowLoading = true) {
			let vm = this;
			let promiseName = "posts-delete-" + postId;

			if(vm.isPhotoOperating){
				return;
			}

			vm.isPhotoOperating = true;
			isShowLoading && vm.$dispatch("show-loading", true);

			Util.abortPromise(promiseName);
			Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.posts_delete, {
				postId
			}), null, "delete").done((data, content, jqXHR) => {
				if(jqXHR.status === 204){
					vm.$emit("post-img-delete", postId);
				}
			}).fail((jqXHR, textStatus) => {
			}).always(() => {
				vm.isPhotoOperating = false;
				Util.promiseCollection[promiseName] = null;
				isShowLoading && vm.$dispatch("show-loading", false);
			});
		}
	}
};