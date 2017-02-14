import * as Config from "../../common/Config";

export default {
	methods: {
		//编辑图片说明
		editPhotoCaption (postId) {
			this.isShowToolMoreMenu = false;
			Config.config.router.go({
				name: "photoCaption",
				params: {
					postId: postId
				}
			});
		}
	}
};