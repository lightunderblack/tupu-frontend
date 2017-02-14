import Vue from "vue";
import Router from "vue-router";

import * as Util from "./common/Util";
import * as Config from "./common/Config";

import PersonalGroup from "./personal-group/index.vue";
import TupuSingle from "./components/single/TupuSingle.vue";
import TupuUserView from "./components/user/TupuUserView.vue";
import TupuComment from "./components/comment/TupuComment.vue";
import TupuSharePicture from "./components/share/TupuSharePicture.vue";
import PersonalGroupList from "./personal-group/PersonalGroupList.vue";
import TupuCreateAlbum from "./components/subscribe/TupuCreateAlbum.vue";
import TupuEditPhotoCaption from "./components/edit/TupuEditPhotoCaption.vue";
import TupuSubscribedUsers from "./components/subscribe/TupuSubscribedUsers.vue";
import TupuSubscribeSuccess from "./components/subscribe/TupuSubscribeSuccess.vue";

Vue.use(Router);

const wx = require("../js/lib/jweixin.min.js");
location.hash = "#posts";

var router = new Router();
router.map({
	"posts":{
		name: "postsList",
		component: PersonalGroupList
	},

    "posts/unfollow/create/album":{
        name: "createAlbum",
        component: TupuCreateAlbum
    },

	"posts/user/:userId": {
		name: "userView",
		component: TupuUserView
	},

	"posts/photo/:uuid/share": {
		name: "sharePhoto",
		component: TupuSharePicture
	},

	"posts/subscribed/:groupId/users": {
		name: "subscribedUsers",
		component: TupuSubscribedUsers
	},

	"posts/subscribe/success": {
		name: "subscribeSuccess",
		component: TupuSubscribeSuccess
	},

	"posts/:page/:postId": {
		name: "postView",
		component: TupuSingle
	},

	"posts/:postId/comment": {
		name: "postComment",
		component: TupuComment
	},

	"posts/:postId/photo/caption": {
		name: "photoCaption",
		component: TupuEditPhotoCaption
	}
});
router.redirect({"*": "/posts"});
Config.config.router = router;

Util.initConfig();//设置配置信息
Util.loadBaseInfo().done(function(){
	Util.cacheUser(Config.userInfo);
	router.start(PersonalGroup, "#content");
});

const config = Config.config;
wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: config.appId, // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature,// 必填，签名，见附录1
    jsApiList: ["hideMenuItems","onMenuShareTimeline","onMenuShareAppMessage","closeWindow","showMenuItems"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
