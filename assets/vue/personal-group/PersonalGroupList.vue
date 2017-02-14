<template>
	<div class="tp-personal-group-list">
		<tupu-top-banner 
			:has-go-back="false"
			:is-go-back-reload="isGoBackReload">
			<div slot="content" v-if="isSubscribed" style="height: 100%;">
				<span class="icon-sprite icon-arrow-right-top share-mark-icon"></span>
				<div class="subscribe-info text-center">
					<span class="icon-sprite icon-share-gray share-icon"></span>按右上角分享给朋友
				</div>
			</div>
			<div slot="content" v-if="isUnSubscribed" style="height: 100%;">
				<a href="#" class="subscribe-btn text-center"
					@click.stop.prevent="subscribeGroup(group.groupId, userInfo.id)">+ 订阅</a>
				<div class="subscribe-info text-left is-living-info" v-if="isLiving">
					相册<strong class="text-warning">正在直播</strong>中，订阅后可实时收到新照片
				</div>
				<div class="subscribe-info text-center" v-else>订阅后可随时收看新照片</div>
			</div>			
		</tupu-top-banner>

		<div class="tupu-user-wrapper clearfix">
			<tupu-user-avatar
				class-name="tp-left"
				:user-id="author.id"
				:user-avatar="author.adminHeadImageUrl">
			</tupu-user-avatar>
			<div class="tupu-subscribe-btn text-center tp-right" @click.stop.prevent="viewSubscribedUsers(group)">
				<p class="subscribed-count">{{group.members_count}}</p>
				<p>订阅</p>
			</div>
			<div class="tupu-user-name ellipsis">{{author.adminName}}</div>
		</div>

		<tupu-cover-banner
			:group="group" 
			:is-living="isLiving">
		</tupu-cover-banner>

		<div class="tp-invitation error" style="display:none;">
			<div class="tp-invitation-bg">
				<div class="tp-icon tp-tip"></div>
				<p>邀请已过期，无法加入</p>
			</div>
		</div>

		<tupu-post-list 
			@set-group="setGroup"
			@set-loading="setLoading">
		</tupu-post-list>

		<tupu-subscribed-footer v-if="isFollowed || isSubscribed"></tupu-subscribed-footer>
		<tupu-unfollow-footer v-else></tupu-unfollow-footer>
	</div>
</template>

<script>
	import Vue from "vue";
	import $ from "jquery";

	import * as Util from "../common/Util";
	import * as Config from "../common/Config";

	import subscribeGroupMixin from "../mixins/subscribe/subscribeGroup";
	import viewSubscribedUsersMixin from "../mixins/subscribe/viewSubscribedUsers";

	import TupuPostList from "../components/list/TupuPostList.vue";
	import TupuUserAvatar from "../components/user/TupuUserAvatar.vue";
	import TupuTopBanner from "../components/banner/TupuTopBanner.vue";
	import TupuCoverBanner from "../components/banner/TupuCoverBanner.vue";
	import TupuUnfollowFooter from "../components/footer/TupuUnfollowFooter.vue";
	import TupuSubscribedFooter from "../components/footer/TupuSubscribedFooter.vue";
	import TupuUnsubscribeFooter from "../components/footer/TupuUnsubscribeFooter.vue";

	const config = Config.config;
	const USER_INFO = Config.userInfo;
	const QINIU_INFO = Config.qiniuInfo;

	export default {
		name: "PersonalGroupList",

		components: {
			TupuPostList,
			TupuTopBanner,
			TupuUserAvatar,
			TupuCoverBanner,
			TupuUnfollowFooter,
			TupuSubscribedFooter,
			TupuUnsubscribeFooter
		},

		mixins: [
			subscribeGroupMixin,
			viewSubscribedUsersMixin
		],

		data () {
			return {
				//照片集拥有者
				author: {
					id: "",
					adminName: "",
					adminHeadImageUrl: ""
				},

				//组相关信息
				group: {
					groupId: "",
					members_count: 0,
					groupName: "「」",
					cover: {
						url: config.emptyImg
					}					
				},

				userInfo: {},//当前登陆者信息
				isInit: false,//是否已初始化
				loadingUrl: "",//加载图标路径
				footerSubQrcodeUrl: config.emptyImg,

				isLiving: false,//是否直播
				isFollowed: false,//是否关注公众号
				isSubscribed: false,//是否已订阅
				isUnSubscribed: false,//是否显示未订阅相关信息
				isShowCoverImg: false,//是否显示封面
				isShowLikeAnimation: false//是否显示动画
			};
		},

		created () {
			var vm = this;

			vm.isInit = true;
			vm.author.adminName = config.adminName;
			vm.userInfo = $.extend(true, {}, USER_INFO);
			vm.author.adminHeadImageUrl = config.adminHeadImageUrl;
			vm.footerSubQrcodeUrl = QINIU_INFO.https_domain + "img/banner_down_qrcodeX2.jpg";			
		},

		route: {
			activate (transition) {
				this.$broadcast("post-list-route", "activate", transition);
				transition.next();
			},

			deactivate (transition) {
				this.$broadcast("post-list-route", "deactivate", transition);
				transition.next();
			}
		},

		methods: {
			//设置组信息
			setGroup (data) {
				let vm = this;
				let group = vm.group;
				let author = data.earliest_members[0].user;
 
				vm.author.id = author.id;

				if(data.cover && data.cover.url){
					group.cover = data.cover;
				}else{
					group.cover.url = config.groupBannerUrl;
					group.cover.width = config.groupBannerWidth;
					group.cover.height = config.groupBannerHeight;
				}

				group.groupId = config.groupId;
				group.groupName = config.groupName;
				group.members_count = data.members_count;

				vm.isSubscribed = data.subscribed;
				vm.isUnSubscribed = !data.subscribed;
				vm.isLiving = data.live.toLowerCase() === "enabled";
				vm.isFollowed = vm.userInfo.mp_followed.toLowerCase() === "true";

				Util.cacheUser(author);
			},

			setLoading (isShow) {
				this.$dispatch("show-loading", isShow);
			}
		}
	};
</script>

<style lang="less">
	@import "../../less/base";
	
	@bgColor: #FFF;
	@avatarSize: 65px;
	@topBannerHeight: 105px;

	.tp-personal-group-list{
		.tp-top-banner{
			top: 0;
			left: 0;
			margin-left: 0;
			position: relative;

			.subscribe-info{
				color: #5A5555;
				font-size: 24px;
			}

			.is-living-info{
				text-indent: 36px;
			}		

			.subscribe-btn{
				top: 30px;
				right: 20px;
				color: #FFF;
				width: 80px;
				height: 45px;
				font-size: 20px;
				line-height: 45px;
				border-radius: 4px;
				position: absolute;
				background: #2F5BA3;
			}
		}
	}


	.tupu-user-wrapper{
		background: @bgColor;
		padding: 21px 22px 19px 20px;

		.tp-user-avatar{
			border-radius: 4px;
			width: @avatarSize;
			height: @avatarSize;
		}

		.tupu-user-name{
   			color: #2F5BA3;
			padding: 0 20px;
			font-size: 26px;
			height: @avatarSize;
			line-height: @avatarSize;			
		}

		.tupu-subscribe-btn{
			top: 12px;
			cursor: pointer;
			font-size: 18px;
			line-height: 22px;
			position: relative;

			.subscribed-count{
				color: #2F5BA3;
				font-size: 22px;
			}
		}
	}
</style>