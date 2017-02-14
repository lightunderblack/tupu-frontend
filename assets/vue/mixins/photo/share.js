import $ from "jquery";
import * as Config from "../../common/Config";

export default {
	methods: {
		sharePhoto (uuid) {
			this.isShowToolShareMenu = false;
			Config.config.router.go({
				name: "sharePhoto",
				params: {
					uuid: uuid
				}
			});
		}
	}
};