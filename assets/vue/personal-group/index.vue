<template>
	<div class="tp-container">
		<router-view
			keep-alive
			transition
      		transition-mode="out-in">
      	</router-view>

	    <tupu-loading
	    	:url="loadingUrl"
	    	:is-show="isShowLoading">
	    </tupu-loading>

	    <tupu-like-animation
			:is-show.sync="isShowLikeAnimation">	
	    </tupu-like-animation>

		<tupu-unlike-animation
			:is-show.sync="isShowUnlikeAnimation">
		</tupu-unlike-animation>

		<tupu-pop-tip :is-show.sync="isShowPopTip" :icon-class-name="iconClassName">
			<template slot="content">{{{popTipContent}}}</template>
		</tupu-pop-tip>	
	</div>
</template>

<script>
	import Vue from "vue";
	import $ from "jquery";

	import * as Util from "../common/Util";
	import * as Config from "../common/Config";

	import avatar from "../filters/avatar";
	import * as formatTimeFilter from "../filters/formatTime";
	
	import TupuPopTip from "../components/TupuPopTip.vue";
	import PersonalGroupList from "./PersonalGroupList.vue";
	import TupuLoading from "../components/loading/TupuLoading.vue";
	import TupuLikeAnimation from "../components/like/TupuLikeAnimation.vue";
	import TupuUnlikeAnimation from "../components/like/TupuUnlikeAnimation.vue";

	const wx = require("../../js/lib/jweixin.min.js");

	//设置过滤器
	Vue.filter("avatar", avatar);
	Vue.filter("timeHandler", formatTimeFilter.timeHandler);

	const config = Config.config;
	const userInfo = Config.userInfo;
	const qiniuInfo = Config.qiniuInfo;
	const Template = {
		album: {
			shareApp: {
				myNormal: {
					title: "打开看看我的相册「{{groupName}}」",
					desc: "请给我的好照片点赞"			
				},
				myLiving: {
					title: "我正在直播「{{groupName}}」",
					desc: "快订阅我的相册，实时收看新照片"
				},
				normal: {
					title: "打开看看{{sex}}的相册「{{groupName}}」",
					desc: "请给{{name}}的好照片点赞"
				},
				living: {
					title: "{{name}}正在直播「{{groupName}}」",
					desc: "快订阅{{sex}}的相册，可实时收看新照片"
				}		
			},
			shareTimeLine: {
				myNormal: {
					title: "打开看看我的相册「{{groupName}}」，请给我的好照片点赞"
				},
				myLiving: {
					title: "请订阅我的直播相册「{{groupName}}」，实时收看新照片"
				},
				normal: {
					title: "打开看看{{sex}}的相册「{{groupName}}」，请给{{name}}的好照片点赞"
				},
				living: {
					title: "请订阅{{name}}的直播相册「{{groupName}}」，可实时收看新照片"
				}		
			}	
		},
		single: {
			my: {
				shareApp: {
					title: "请给我的照片点赞",
					desc: "在{{groupName}}添加了好照片"
				},
				shareTimeline: {
					title: "请给我的照片点赞：在{{groupName}}添加了好照片"
				}
			},
			other: {
				shareApp: {
					title: "请给{{name}}的照片点赞",
					desc: "在{{groupName}}看到好照片"
				},
				shareTimeline: {
					title: "请给{{name}}的照片点赞：在{{groupName}}看到好照片"
				}			
			}			
		}
	};	

	export default {
		name: "PersonalGroup",

		components: {
			TupuPopTip,
			TupuLoading,
			PersonalGroupList,
			TupuLikeAnimation,
			TupuUnlikeAnimation
		},

		data () {
			return {
				loadingUrl: "",
				iconClassName: "",
				popTipContent: "",

				isShowPopTip: false,
				isShowLoading: false,
				isShowLikeAnimation: false,
				isShowUnlikeAnimation: false
			};
		},

		created () {
			let vm = this;

			vm.isShowLoading = true;//显示加载图标
			vm.loadingUrl = qiniuInfo.https_domain + "img/loading.gif";
		},

		methods: {
			setWxShare (group, photo, type = "album") {
				let vm = this;
				let wxShareConfig;

				group = $.extend(true, {}, group);
				photo = $.extend(true, {}, photo);

				if(type === "single"){
					wxShareConfig = vm.getSingleWxShareConfig(group, photo);
				}else{
					if((wxShareConfig = vm.albumWxShareConfig)){
						wxShareConfig.shareTimeLine.link = wxShareConfig.shareApp.link = location.href.replace(/#[^#]+/, "");
					}else{
						wxShareConfig = vm.getAlbumWxShareConfig(group, photo);	
					}
				}

				wx.ready(function(){
					wx.showMenuItems({
						menuList: [
							"menuItem:share:timeline",
							"menuItem:share:appMessage"
						]
					});
					wx.hideMenuItems({
						menuList: [
							"menuItem:share:qq", 
							"menuItem:share:weiboApp", 
							"menuItem:share:faceboo", 
							"menuItem:share:QZone", 
							"menuItem:openWithQQBrowser", 
							"menuItem:openWithSafari", 
							"menuItem:exposeArticle",
							"menuItem:originPage",
							"menuItem:readMode",
							"menuItem:share:email",
							"menuItem:setFont"
						]
					});				
					wx.onMenuShareAppMessage(wxShareConfig.shareApp);
					wx.onMenuShareTimeline(wxShareConfig.shareTimeLine);
				});
			},

			getAlbumWxShareConfig (data = {}, photo = {}) {
				let vm = this;

				let group = data;
				let wxShareConfig;
				let location = window.location;
				let https =  qiniuInfo.https_domain;
				let isLiving = data.live === "enabled";
				let author = data.earliest_members[0].user;
				let isMine = author.id === userInfo.id;

				let shareApp = Template.album.shareApp;
				let shareTimeLine = Template.album.shareTimeLine;

				let imgUrl = https + "img/album_blue_square.png";
				let sex = ({1: "他", 2: "她"})[author.sex] || "TA";
				let link = location.href.replace(/#[^#]+/, "");
				let key = isMine ? ("my-" + (isLiving ? "living" : "normal")) : (isLiving  ? "living" : "normal");
				if(isLiving){
					imgUrl = https + "img/living-tip-icon.png";
				}else if(photo){
					imgUrl = photo.url || imgUrl;
				}
				key = $.camelCase(key);
				let desc = Util.replaceTpl(shareApp[key].desc, {
					sex,
					name: author.nickname,
					groupName: group.name
				});
				let title = Util.replaceTpl(shareTimeLine[key].title, {
					sex,
					name: author.nickname,
					groupName: group.name
				});
				let appTitle = Util.replaceTpl(shareApp[key].title, {
					sex,
					name: author.nickname,
					groupName: group.name
				});
				wxShareConfig = {
					shareApp: {
						link,
						desc,
						imgUrl,
						title: appTitle
					},
					shareTimeLine: {
						link,
						title,
						imgUrl
					}
				};

				vm.albumWxShareConfig = wxShareConfig;

				return wxShareConfig;
			},

			getSingleWxShareConfig (post = {}, photo = {}) {
				let user = post.user;

				let template = Template.single[user.id == userInfo.id ? "my" : "other"];
				let shareApp = template.shareApp;
				let shareTimeline = template.shareTimeline;
				let groupName = (post.groups[0] || {}).name;
				let link = config.host + "p/" + post.uuid + "/";
				let wxConfig = {
					name: user.nickname,
					sex: ({1: "他", 2: "她"})[user.sex] || "TA",
					groupName: groupName ? ("相册「" + groupName + "」") : "图扑"
				};

				let desc = Util.replaceTpl(shareApp.desc, wxConfig);
				let appTitle = Util.replaceTpl(shareApp.title, wxConfig);
				let title = Util.replaceTpl(shareTimeline.title, wxConfig);
				let imgUrl = photo.url || userInfo.https_domain + "img/album_blue_square.png";

				let wxShareConfig = {
					shareApp: {
						link,
						desc,
						imgUrl,
						title: appTitle
					},
					shareTimeLine: {
						link,
						title,
						imgUrl
					}
				};

				return wxShareConfig;
			}
		},

		events: {
			"show-like-animation" () {
				this.isShowLikeAnimation = true;
			},

			"show-unlike-animation" () {
				this.isShowUnlikeAnimation = true;
			},

			"show-loading" (isShow) {
				this.isShowLoading = !!isShow;
			},

			"show-pop-tip" (popTipContent = "", iconClassName = "icon-check-blue") {
				let vm = this;
				
				vm.isShowPopTip = true;
				vm.iconClassName = iconClassName;
				vm.popTipContent = popTipContent;	
			},

			"set-wx-share" (group, photo, type) {
				this.setWxShare(group, photo, type);
			}
		}
	};
</script>

<style lang="less">
	@import "../../less/common";
	@import "../../css/sprites.css";
</style>