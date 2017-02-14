<template>
	<div class="tp-share-picture-wrapper tp-container-wrapper">
		<tupu-top-banner 
			:has-go-back="true" 
			:is-go-back-reload="isGoBackReload">
			<template slot="content">
				<p class="text-center">
					<i class="icon-sprite icon-share-gray share-icon"></i>请按右上角分享给朋友
				</p>
				<i class="icon-sprite icon-arrow-right-top share-mark-icon"></i>
			</template>
		</tupu-top-banner>

	    <div class="tp-container-info">
	    	<div class="tp-share-picture">
				<div class="tp-post-info bg-white clearfix">
					<tupu-user-avatar
						class-name="tp-left" 
						:user-id="post.user.id"
						:user-avatar="post.user.headimgurl">
					</tupu-user-avatar>

					<div class="tp-post-author">
						<p class="author-name ellipsis">{{post.user.nickname}}</p>
						<p class="post-time">{{post.created | timeHandler}}</p>
					</div>
				</div>

				<div class="tp-post-img bg-white">
					<img :src="post.photo.url">
				</div>

				<div class="tp-post-desc bg-white" 
					v-show="post.photo.caption">{{post.photo.caption}}</div>
				
				<div class="tp-post-tool bg-white clearfix">
					<span class="post-like tp-left">
						<i class="post-like-count">{{post.likes_count}}</i>赞
					</span>

					<ul class="clearfix tp-post-tool-list tp-right">
						<li class="tp-left post-comment-white">
							<tupu-tool-comment 
								:post="post"
								class-name="icon-comment-gray">
							</tupu-tool-comment>
						</li>
						<li class="tp-left post-more-white" @click.stop="showToolMoreMenu">
							<tupu-tool-more 
								class-name="icon-more-gray">
							</tupu-tool-more>
						</li>
						<li class="tp-left post-tool-like">
							<tupu-tool-like 
								:post="post" 
								liked-class-name="icon-liked-full" 
								like-class-name="icon-like-redline">
							</tupu-tool-like>
						</li>
					</ul>
				</div>

				<div class="tp-post-group bg-white clearfix">
					<span class="tp-left tp-post-group-title">来自相册</span>
					<div class="tp-post-group-name">
						<p>「{{post.groups[0].name}}」</p>
					</div>	
				</div>
				
				<div class="tp-liked-user-list-container" v-show="post.likes_count">
					<p class="tp-liked-user-list-title">{{users | person}}赞了照片</p>
			    	<tupu-liked-user-list 
			    		:post-id="post.id"
			    		:users.sync="users">
			    	</tupu-liked-user-list>				
				</div>	    		
	    	</div>

			<tupu-download-app-link></tupu-download-app-link>	    	
	    </div>

		<tupu-pop-menu :is-show.sync="isShowToolMoreMenu">
			<li v-show="isShowEdit">
				<a href="#" @click.prevent.stop="editPhotoCaption(post.id)">编写照片说明</a>
			</li>
			<li v-show="isShowReport">
				<a href="#" class="warning" @click.prevent.stop="reportPhoto(post.id)">举报照片</a>
			</li>
			<li>
				<a href="#" @click.prevent.stop="hideToolMoreMenu">取消</a>
			</li>
		</tupu-pop-menu>
	</div>
</template>

<script>
	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";

	import viewUserMixin from "../../mixins/viewUser";
	import sharePhotoMixin from "../../mixins/photo/share";
	import reportPhotoMixin from "../../mixins/photo/report";
	import deletePhotoMixin from "../../mixins/photo/delete";
	import toolMoreMenuMixin from "../../mixins/toolMoreMenu";
	import downloadPhotoMixin from "../../mixins/photo/download";
	import editPhotoCaptionMixin from "../../mixins/photo/editCaption";

	import TupuPopMenu from "../TupuPopMenu.vue";
	import TupuToolMore from "../TupuToolMore.vue";
	import TupuToolLike from "../like/TupuToolLike.vue";	
	import TupuConfirm from "../dialog/TupuConfirm.vue";
	import TupuUserAvatar from "../user/TupuUserAvatar.vue";
	import TupuTopBanner from "../banner/TupuTopBanner.vue";
	import TupuToolComment from "../comment/TupuToolComment.vue";
	import TupuLikedUserList from "../like/TupuLikedUserList.vue";
	import TupuDownloadAppLink from "../downloadApp/TupuDownloadAppLink.vue";

	const wx = require("../../../js/lib/jweixin.min.js");

	const config = Config.config;
	const USER_INFO = Config.userInfo;
	const QINIU_INFO = Config.qiniuInfo;
	const LOADING_POST_DATA = "loading-post-data";
	const API = {
		shares: "shares/photo/"
	};	
	const Template = {
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
	};

	export default {
		name: "TupuSharePicture",

		components: {
			TupuPopMenu,
			TupuToolLike,
			TupuToolMore,
			TupuTopBanner,
			TupuUserAvatar,
			TupuToolComment,
			TupuLikedUserList,
			TupuDownloadAppLink
		},

		mixins: [
			viewUserMixin,
			sharePhotoMixin,
			reportPhotoMixin,
			deletePhotoMixin,
			toolMoreMenuMixin,
			downloadPhotoMixin,
			editPhotoCaptionMixin
		],

		filters: {
			person (users) {
				let person = "";
				let length = users.length;

				if(length === 1){
					let user = users[0];
					if(user.id === USER_INFO.id){
						person = "我";
					}else{
						person = ({1: "他", 2: "她"})[user.sex] || "TA";	
					}					
				}else if(length > 1){
					person = "他们";	
				}

				return person;
			}
		},

		data () {
			return {
				users: [],

				post: {
					user: {},
					likes: [],
					photo: {},
					groups: [{}]
				},

				isShowEdit: false,
				isShowReport: false,
				isShowDelete: false,
				isGoBackReload: false,

				isShowToolMoreMenu: false,
				isShowToolShareMenu: false,				
			};
		},

		watch: {
			users (val, oldVal){
				let user;
				let vm = this;
				let likedPeople;
				let length = val.length;

				if(length === 1){
					user = val[0];
					if(user.id === USER_INFO.id){
						likedPeople = "我";
					}else{
						likedPeople = ({1: "他", 2: "她"})[user.sex] || "TA";	
					}
				}else if(length > 1){
					likedPeople = "他们";
				}else{
					likedPeople = "";
				}

				vm.likedPeople = likedPeople;
			}
		},

		directives: {
			"set-cover-img" (photo) {
				let maxWidth = 640;

				if(photo && photo.url){
					$(this.el).css({
						"margin-top": Math.floor((384 - (maxWidth) * photo.height / photo.width) / 2)
					});
				}
			}
		},		

		route: {
			data ({to, from}) {
				let vm = this;

				$(window).scrollTop(0);

				if(({userView: 1, postComment: 1})[from.name]){
					vm.$broadcast("load-liked-user-list", false);
					vm.$dispatch("set-wx-share", vm.post, vm.post.photo, "single");
				}else{
					vm.loadData(to.params.uuid);
				}
			},

			deactivate (transition) {
				this.$broadcast("reset-liked-user-list", !({userView: 1, postComment: 1})[transition.to.name]);
				transition.next();
			}
		},

		methods: {
			loadData (uuid) {
				let vm = this;
				let isAborted = false;

				vm.$dispatch("show-loading", true);
				Util.abortPromise(LOADING_POST_DATA);
				Util.promiseCollection[LOADING_POST_DATA] = Util.request(API.shares, {
					post_uuid: uuid
				}).done((data) => {
					if(data.post && data.post.id){
						vm.post = data.post;
						vm.$nextTick(() => vm.$broadcast("load-liked-user-list", true));
						Util.cacheUser(vm.post.user);
						vm.isShowEdit = vm.isShowDelete = USER_INFO.uuid === vm.post.user.uuid;
						vm.isShowReport = !vm.isShowEdit;
						vm.$dispatch("set-wx-share", data.post, data.post.photo, "single");
					}
				}).fail((jqXHR, textStatus) => {
					isAborted = textStatus === "abort";
				}).always(() => {
					if(!isAborted){
						vm.$dispatch("show-loading", false);
						Util.promiseCollection[LOADING_POST_DATA] = null;
					}
				});
			}
		},

		events: {
			"post-img-delete" () {
				this.isGoBackReload = true;
				Config.config.router.replace({
					name: "postsList"
				});
			},

			"post-tool-set-like-end" (isLiked) {
				let post;
				let vm = this;
				let users = vm.users;
				let posts = Config.posts.data;
				let item = $.extend(true, {}, USER_INFO);

				if(isLiked){
					users.unshift(item);
				}else{
					users.splice(Util.getIndexById(users, item.id), 1);
				}

				if((posts || []).length 
					&& (post = posts[Util.getIndexById(posts, vm.post.id)])){
					post.liked = isLiked;
					post.likes_count = isLiked ? (post.likes_count + 1) : (post.likes_count - 1);
				}
			}			
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";
	
	@bgColor: #FFF;
	@color: #5A5555;
	@borderColor: #DDD;

	@gutter: 20px;
	@largeGutter: 40px;

	@maxCoverHeight: 384px;

	@avatarWidth: 65px;
	@avatarHeight: 65px;

	@likeFontSize: 28px;
	@descFontSize: 28px;
	@postTimeFontSize: 18px;
	@authorNameFontSize: 32px;

	@likeLineHeight: 37px;
	@descLineHeight: 70px;
	@postTimeLineHeight: 22px;
	@authorNameLineHeight: 33px;	

	.tp-share-picture{
		border-bottom: 1px solid @bgColor;

		.bg-white{
			background: @bgColor;	
		}

		.tp-post-info{
			padding: 20px;
			
			.tp-post-author{
				padding-left: @gutter + @avatarWidth;		
			}

			.author-avatar{
				border-radius: 6px;
				width: @avatarWidth;
				height: @avatarHeight;
			}

			.author-name{
				color: #2F5BA3;
				margin-bottom: 5px;
				font-size: @authorNameFontSize;
				height: @authorNameLineHeight;
				line-height: @authorNameLineHeight;
			}

			.post-time{
				color: #AAA;
				font-size: @postTimeFontSize;
				height: @postTimeLineHeight;
				line-height: @postTimeLineHeight;				
			}
		}

		.tp-post-img{
			overflow: hidden;
			text-align: center;
			/*height: @maxCoverHeight;*/

			img{
				max-width: 100%;
			}
		}

		.tp-post-desc{
			color: @color;
			font-size: 28px;
			line-height: 40px;
			padding: 24px 20px;
			border-bottom: 1px solid @borderColor;
		}

		.tp-post-tool{
			padding: 26px 20px 25px;
			border-bottom: 1px solid @borderColor;

			.post-like{
				top: 6px;
				color: @color;
				position: relative;
				height: @likeLineHeight;
				font-size: @likeFontSize;
				line-height: @likeLineHeight;
			}

			.post-like-count{
				margin-right: 5px;
			}
		}

		.tp-post-group{
			height: 105px;
			font-size: 28px;
			padding: 0 20px;
			overflow: hidden;
			margin-bottom: 40px;
			line-height: 105px;
		}

		.tp-post-group-name{
			height: 100%;
			display: flex;
			color: #5A5555;
			line-height: 28px;
			padding-left: 14px;
			align-items: center;
		}

		.tp-post-group-title{
			color: #AAA;
		}

		.tp-post-tool-list{
			li{
				width: 46px;
    			height: 52px;
    			position: relative;
    			line-height: 52px;
    			text-align: center;
				margin-right: 60px;

				&:last-child{
					margin-right: 0;
				}
			}

			i{
				position: relative;
			}			

			.icon-more-white{
				top: -2px;
			}

			.post-comment-white{
				top: 6px;
			}

			.post-tool-like{
				top: 4px;
			}
		}

		.tp-liked-user-list-container{
			background: @bgColor;
			border-bottom: 1px solid @borderColor;

			.tp-liked-user-list-title{
				color: #AAA;
				font-size: 30px;
				padding: 30px 20px 0;
			}

			.tp-user-list-wrapper{
				padding-top: 0;
			}
		}
	}
</style>