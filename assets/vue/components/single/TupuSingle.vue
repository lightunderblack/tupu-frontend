<template>
	<div class="tp-post-view-wrapper">
		<tupu-single-user-info
			:user="post.user"
			:created="post.created"
			transition="tupu-fade"
			v-show="isShowInfoTool"
			class="tp-post-view-overlay">
		</tupu-single-user-info>

		<tupu-photo-caption 
			transition="tupu-fade"
			class="tp-post-view-overlay"
			:caption="post.photo.caption"
			v-show="post.photo.caption && isShowInfoTool">
		</tupu-photo-caption>

		<div class="tp-post-tool tp-post-view-overlay clearfix" 
			transition="tupu-fade"
			v-show="isShowInfoTool">
			<span class="post-like tp-left">
				<i class="post-like-count">{{post.likes_count}}</i>赞
			</span>
			<ul class="clearfix tp-post-tool-list tp-right">
				<li class="tp-left post-comment-white">
					<tupu-tool-comment :post="post" class-name="icon-comment"></tupu-tool-comment>
				</li>

				<li class="tp-left post-more-white" @click.stop="showToolMoreMenu">
					<tupu-tool-more></tupu-tool-more>
				</li>

				<li class="tp-left post-share-white" @click.stop="showToolShareMenu">
					<tupu-tool-share></tupu-tool-share>	
				</li>
				
				<li class="tp-left post-tool-sticky" v-show="post.sticky">
					<tupu-tool-sticky></tupu-tool-sticky>
				</li>

				<li class="tp-left post-tool-like" v-else>
					<tupu-tool-like :post="post"></tupu-tool-like>
				</li>
			</ul>
		</div>

		<ul class="tp-post-img-list"
			v-touch:swiperight="viewPre"
			v-touch:swipeleft="viewNext"
			v-touch:tap="setInfoToolVisibility"
			v-touch:pinchstart="scaleViewStart"
			v-touch:pinchmove="scaleView($event)"
			v-touch:pinchend="scaleViewEnd($event)"
			v-touch:panstart="moveViewStart($event)"
			v-touch:panmove="moveView($event)"
			v-touch:press="moveView($event)"
			@transitionend="viewTransitionEnd"
			v-touch-options:swipe="{direction: 'horizontal'}">
			<li class="tp-post-img-item tp-post-img-left tp-left">
				<img src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==">
			</li>
			<li class="tp-post-img-item tp-post-img-center tp-left">
				<img src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==">
			</li>
			<li class="tp-post-img-item tp-post-img-right tp-left">
				<img src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==">
			</li>
		</ul>

		<tupu-download-app-modal
			v-show="appDownModal.isShow" 
			:class="appDownModal.classList"
			@transitionend="appTransitionEnd"
			v-touch:swipeleft="appSlideLeft"
			v-touch:swiperight="appSlideRight"
			v-touch-options:swipe="{direction: 'horizontal'}"
			:app-download-img="appDownModal.img">
		</tupu-download-app-modal>

		<tupu-pop-menu :is-show.sync="isShowToolMoreMenu">
			<li v-show="isShowEdit">
				<a href="#" @click.prevent.stop="editPhotoCaption(post.id)">编写照片说明</a>
			</li>
			<li v-show="isShowReport">
				<a href="#" class="warning" @click.prevent.stop="reportPhoto(post.id)">举报照片</a>
			</li>
			<li v-show="isShowDelete">
				<a href="#" class="warning" @click.prevent.stop="deletePhoto(post.id)">删除照片</a>
			</li>
			<li>
				<a href="#" @click.prevent.stop="hideToolMoreMenu">取消</a>
			</li>
		</tupu-pop-menu>

		<tupu-pop-menu :is-show.sync="isShowToolShareMenu">
			<li>
				<a href="#" @click.prevent.stop="sharePhoto(post.uuid)">分享这张照片</a>
			</li>	
			<li>
				<a href="#" @click.prevent.stop="hideToolShareMenu">取消</a>
			</li>
		</tupu-pop-menu>
	</div>
</template>

<script>
	import Vue from "vue";
	import $ from "jquery";
	import VueTouch from "vue-touch";

	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";

	import viewUserMixin from "../../mixins/viewUser";
	import shareMenuMixin from "../../mixins/shareMenu";
	import sharePhotoMixin from "../../mixins/photo/share";
	import reportPhotoMixin from "../../mixins/photo/report";
	import deletePhotoMixin from "../../mixins/photo/delete";
	import toolMoreMenuMixin from "../../mixins/toolMoreMenu";
	import downloadPhotoMixin from "../../mixins/photo/download";
	import editPhotoCaptionMixin from "../../mixins/photo/editCaption";

	import TupuPopMenu from "../TupuPopMenu.vue";
	import TupuToolMore from "../TupuToolMore.vue";
	import TupuToolLike from "../like/TupuToolLike.vue";
	import TupuToolShare from "../share/TupuToolShare.vue";
	import TupuToolSticky from "../sticky/TupuToolSticky.vue";
	import TupuPhotoCaption from "../edit/TupuPhotoCaption.vue";
	import TupuToolComment from "../comment/TupuToolComment.vue";
	import TupuSingleUserInfo from "../single/TupuSingleUserInfo.vue";
	import TupuDownloadAppModal from "../downloadApp/TupuDownloadAppModal.vue";

	let Hammer = require("../../../js/lib/hammer.min.js");

	Vue.use(VueTouch);

	const API = {
		groups_posts: "groups/{{groupId}}/posts/",//获取组下照片
		image_thumbnail: "{{url}}?imageView/2/w/{{width}}/h/{{height}}/"
	};
	const LOADING_LOCATION = {
		width: 50, 
		height: 50, 
		marginTop: -25,
		marginLeft: -25
	};
	const $window = $(window);
	const VIEW_POINT_WIDTH = 640;
	const config = Config.config;
	const userInfo = Config.userInfo;
	const qiniuInfo = Config.qiniuInfo;
	const SHOW_INFO_TOOL_TIMER = 2500;
	const LOADING_CLASSNAME = "animation-loading";
	const LOADING_SINGLE_VIEW_DATA = "loadSingleViewData";

	let loadingUrl;
	let util = {
		str2Num (str) {
			str = $.trim(str);
			return isNaN(str) ? 0 : parseFloat(str);
		},

		isFirst (index) {
			return index === 0;
		},

		isLast (index) {
			return index === Config.posts.data.length - 1;
		},	

		getNextPost (index) {
			if(util.isLast(index)){
				return {photo: {}};
			}else{
				return util.getPostByIndex(index + 1);
			}
		},

		getPrevPost (index) {
			if(util.isFirst(index)){
				return {photo: {}};				
			}else{
				return util.getPostByIndex(index - 1);
			}
		},

		getIndexById (id) {
			return Util.getIndexById(Config.posts.data, id);
		},

		getPostByIndex (index) {
			return Config.posts.data[index];
		},

		getPostById (id) {
			return Config.posts.data[util.getIndexById(id)];
		},

		prepareImage ($parent, url, width, height) {
			let image = new Image(),
				deferred = $.Deferred(),
				onloaded = function(){
					deferred.resolve(image, url, util.resizeImage(width, height));
					this.onload = this.onerror = null;
				};

			image.onload = onloaded;
			image.onerror = function(){
				deferred.reject();
				this.onload = this.onerror = image = null;
			};
			image.src = Util.replaceTpl(API.image_thumbnail, {
				url: url,
				width: width,	
				height: height
			});
			$parent.append($(image).addClass("display-none tp-post-temp"));
			if(image.complete){
				onloaded.call(image);
			}

			return deferred;
		},

		resizeImage (imgWidth, imgHeight) {
			let marginTop = 0,
				marginLeft = 0,
				width = imgWidth,
				height = imgHeight,
				VIEW_POINT_HEIGHT = $window.height();

			if(imgWidth > VIEW_POINT_WIDTH || imgHeight > VIEW_POINT_HEIGHT){
				if(imgWidth >= imgHeight){
					width = VIEW_POINT_WIDTH;
					height = imgHeight * width / imgWidth;
				}else{
					height = VIEW_POINT_HEIGHT;
					width = imgWidth * height / imgHeight;
				}

				if(width > VIEW_POINT_WIDTH){
					width = VIEW_POINT_WIDTH;
					height = imgHeight * width / imgWidth;
				}				
			}

			width = Math.ceil(width);
			height = Math.ceil(height);
			marginLeft = -Math.ceil(width / 2);
			marginTop = -Math.ceil(height / 2);

			return {
				width,
				height,
				marginTop,
				marginLeft
			};
		},

		markTransition (element, isNext) {
			$(element).find(".tp-post-img-list").addClass("transition " + (isNext ? "next" : "prev"));
		},		

		showImage ($element, photo, id) {
			util.showLoading($element);
			util.prepareImage($element.parent(), photo.url, photo.width, photo.height).done((function($element, photo, id){
				return function(image, url, size){
					if($element.data("id") == null || $element.data("id") == id){
						let $wrapper = $element.parent();
						$element.remove();
						$wrapper.find(".tp-post-temp").removeClass("display-none tp-post-temp").css(size).data({
							id: null,
							loading: false
						});
					}
					photo = $element = id = image = null;
				};
			})($element, photo, id));
		},

		showLoading ($element) {
			$element
				.css(LOADING_LOCATION)
				.attr("src", loadingUrl)
				.addClass(LOADING_CLASSNAME)
				.data("loading", true);
		}
	};

	export default {
		name: "TupuSingle",

		components: {
			TupuPopMenu,
			TupuToolLike,
			TupuToolMore,
			TupuToolShare,
			TupuToolSticky,
			TupuToolComment,
			TupuPhotoCaption,
			TupuSingleUserInfo,
			TupuDownloadAppModal
		},	

		mixins: [
			viewUserMixin,
			shareMenuMixin,
			sharePhotoMixin,
			reportPhotoMixin,
			deletePhotoMixin,
			toolMoreMenuMixin,
			downloadPhotoMixin,
			editPhotoCaptionMixin
		],

		data () {
			return {
				isShowEdit: false,
				isShowDelete: false,
				isShowReport: false,
				isShowInfoTool: false,
				isShowToolMoreMenu: false,
				isShowToolShareMenu: false,

				appDownModal: {
					isShow: false,
					img: config.emptyImg,
					classList: {
						last: false,
						first: false,
						transition: false						
					}	
				},			

				post: {
					uuid: "",
					likes_count: 0,
					photo: {
						url: "",
						caption: ""
					},
					user: {
						headimgurl: config.emptyImg	
					}
				},

				nextPost: {
					photo: {
						url: ""
					}
				},

				prevPost: {
					photo: {
						url: ""
					}				
				}
			}
		},

		watch: {
			"post.liked" (val, oldVal) {
				let vm = this;

				if(val){
					vm.likes_count += 1;
				}else{
					vm.likes_count -= 1;
				}
			},

			"post" (val, oldVal) {
				let vm = this;
				let $element = $(vm.$el);

				if(val && val.photo && $.trim(val.photo.url)){
					Util.cacheUser(val.user);
					util.showImage(
						$element
						.find(".tp-post-img-center img")
						.data("id", val.id), val.photo, val.id);
				}
			},

			"nextPost" (val, oldVal) {
				if(val && val.photo && $.trim(val.photo.url)){
					let $nextImg = $(this.$el).find(".tp-post-img-right img").data("id", val.id);
					util.showImage($nextImg, val.photo, val.id);
				}				
			},

			"prevPost" (val, oldVal) {
				if(val && val.photo && $.trim(val.photo.url)){
					let $prevImg = $(this.$el).find(".tp-post-img-left img").data("id", val.id);
					util.showImage($prevImg, val.photo, val.id);	
				}				
			}
		},

		route: {
			data ({to, from}) {
				let vm = this;
				let posts = Config.posts;

				vm.$dispatch("show-loading", false);
				vm.appDownModal.img = qiniuInfo.https_domain + "img/tp_info.png";

				if(vm.isRouterReplace){
					vm.$dispatch("set-wx-share", vm.post, vm.post.photo, "single");
				}else{
					let page = parseInt(to.params.page || 0);

					vm.isShowInfoTool = true;
					vm.postId = to.params.postId;
					loadingUrl = qiniuInfo.https_domain + "img/loading_web.png";
					util.showLoading($(vm.$el).find(".tp-post-img-center img"));
					if(posts.data && posts.data.length){
						vm.page = page;
						vm.setData();
					}else{
						vm.loadData(page);
					}					
				}
			},

			activate (transition) {
				let vm = this;
				let $element = $(vm.$el);

				$element.height($window.height() + 1);
				$window.off(".tupuSingle").on("orientationchange.tupuSingle", function(){
					$element.height($window.height() + 1);
				}).on("resize.tupuSingle", function(){
					$element.height($window.height() + 1);	
				});
				vm.$currentElement = $(vm.$el).find(".tp-post-img-center");
				transition.next();
			},

			deactivate (transition) {
				let vm = this;
				let $el = $(this.$el);

				vm.resetData();
				$window.off(".tupuSingle");
				Util.abortPromise(LOADING_SINGLE_VIEW_DATA);
				$el.find(".tp-post-img-list img").each(function(){$(this).data("id", null);});
				util.showLoading($el.find(".tp-post-img-center img"));

				transition.next();
			}
		},

		methods: {
			//是否向后
			isNext (page) {
				return page > this.page;
			},

			//是否向前
			isPrev (page) {
				return page < this.page;
			},

			resetAppDownloadStatus () {
				let vm = this;
				vm.appDownModal.isShow = false;
				vm.appDownModal.classList.last = false;
				vm.appDownModal.classList.first = false;				
			},

			showAppDownload (isFirst = false) {
				let vm = this,
					appDownModal = vm.appDownModal;

				appDownModal.isLeft = isFirst;
				appDownModal.isShow = true;
				appDownModal.classList.last = !isFirst;
				appDownModal.classList.first = isFirst;
				appDownModal.classList.transition = true;

				setTimeout(() => isFirst ? (appDownModal.classList.first = false) : (appDownModal.classList.last = false), 100);
			},

			//下张
			viewNext () {
				let index, vm = this;

				if(vm.isSwipe 
						|| vm.isPending 
							|| vm.isPhotoOperating){
					return;
				}

				vm.isSwipe = true;
				index = vm.currentIndex + 1;

				if(index === Config.posts.data.length){
					if(Config.posts.hasNext){
						vm.resetAppDownloadStatus();
						vm.loadData(vm.page + 1).done(() => util.markTransition(vm.$el, true));
					}else{
						vm.showAppDownload();
					}
				}else{
					vm.currentIndex = index;
					vm.resetAppDownloadStatus();					
					util.markTransition(vm.$el, true);
				}
			},

			//上张
			viewPre (event) {
				let index, vm = this;

				if(vm.isSwipe 
						|| vm.isPending 
							|| vm.isPhotoOperating){
					return;
				}

				vm.isSwipe = true;
				index = vm.currentIndex - 1;

				if(vm.currentIndex === 0){
					if(vm.page > 1){
						vm.resetAppDownloadStatus();
						vm.loadData(vm.page - 1).done(() => util.markTransition(vm.$el, false));	
					}else{
						vm.showAppDownload(true);
					}
				}else{
					vm.currentIndex = index;
					vm.resetAppDownloadStatus();
					util.markTransition(vm.$el, false);
				}
			},

			//缩放图片开始
			scaleViewStart () {
				let vm = this;
				let $currentElement = vm.$currentElement;
				let $currentImg = $currentElement.find("img");

				if(vm.isSwipe 
					|| $currentImg.data("loading")){
					return;
				}

				vm.isScale = true;
				vm.scaleFactor = $currentImg.data("scale") || 1;
			},

			//缩放图片
			scaleView (event) {
				let vm = this;
				let $currentImg = vm.$currentElement.find("img");

				if(vm.isSwipe || $currentImg.data("loading")){
					return;
				}

				let photo = vm.post.photo;
				let scale = event.scale * vm.scaleFactor;
				let marginTop = -Math.ceil(scale * photo.height) / 2;
				let marginLeft = -Math.ceil(scale * photo.width) / 2;

				$currentImg.data({
					scale,
					marginTop,
					marginLeft
				}).css({
					transform: Util.replaceTpl("scale({{scale}})", {scale})
				});
			},

			//缩放结束
			scaleViewEnd (e) {
				let vm = this;

				if(e.scale < 1){
					let photo = vm.post.photo;
					let size = util.resizeImage(photo.width, photo.height);

					vm.$currentElement
						.find("img")
						.css($.extend(size, {
							transform: "none"
						}))
						.data({
							scale: 1
						});
				}

				setTimeout(() => vm.isScale = false, 200);
			},

			//移动图片开始
			moveViewStart () {
				let vm = this;
				let $currentImg = vm.$currentElement.find("img");

				if(vm.isSwipe || $currentImg.data("loading")){
					return;
				}

				$currentImg.data({
					marginTop: parseInt(window.getComputedStyle($currentImg[0], null).marginTop),
					marginLeft: parseInt(window.getComputedStyle($currentImg[0], null).marginLeft)
				});
			},

			//移动图片
			moveView (e) {
				let vm = this;
				let $currentImg = vm.$currentElement.find("img");
				let scale = $currentImg.data("scale") || 1;

				if(scale === 1 
						|| vm.isScale 
							|| vm.isSwipe
								|| $currentImg.data("loading")){
					return;
				}

				if(Math.abs(e.deltaX) < 400 && Math.abs(e.deltaY) < 400){
					let marginTop = e.deltaY + $currentImg.data("marginTop");
					let marginLeft = e.deltaX + $currentImg.data("marginLeft");
					$currentImg.css({marginTop, marginLeft});
				}
			},

			//载入数据
			loadData (page = 1){
				let promise,
					vm = this,
					promiseName = LOADING_SINGLE_VIEW_DATA;

				vm.isPending = true;
				Util.abortPromise(promiseName);
				promise = Util.request(Util.replaceTpl(API.groups_posts, {
					groupId: config.groupId		
				}), {
					page: page,
					compact: true	
				}).done(function(data){
					let posts = Config.posts;

					vm.isPrev(page) ? $.each(data.posts.reverse(), (i, item) => {
						item._pageCount = page;
						posts.data.unshift(item);
					}) : $.each(data.posts, (i, item) => {
						item._pageCount = page;
						posts.data.push(item);
					});

					posts.hasNext = data.pagination && data.pagination.has_next;

					if(vm.postId == null){
						if(vm.isPrev(page)){
							vm.currentIndex = data.posts.length - 1;
							vm.prevPost = util.getPostByIndex(vm.currentIndex);
						}else{
							vm.currentIndex = vm.currentIndex + 1;
							vm.nextPost = util.getPostByIndex(vm.currentIndex);
						}
					}else{
						vm.setData();
					}

					vm.page = page;
				}).fail(function(jqXHR, textStatus){
				}).always(function(){
					vm.isPending = false;
					vm = Util.promiseCollection[promiseName] = null;
				});

				return (Util.promiseCollection[promiseName] = promise);
			},

			resetData () {
				let vm = this,
					appDownModal = vm.appDownModal;

				vm.post = {
					uuid: "",
					likes_count: 0,
					photo: {
						url: "",
						caption: ""
					},
					user: {
						headimgurl: config.emptyImg	
					}
				};

				vm.isSwipe = false;
				vm.isPending = false;
				vm.isShowEdit = false;
				vm.isShowReport = false;
				vm.isShowDelete = false;
				vm.isRouterReplace = false;
				vm.isPhotoOperating = false;
				vm.isPhotoOperating = false;
				vm.isShowToolMoreMenu = false;
				vm.isShowToolShareMenu = false;		

				appDownModal.isShow = false;
				appDownModal.classList.last = false;
				appDownModal.classList.first = false;
				appDownModal.classList.transition = false;
			},

			setData () {
				let vm = this;

				vm.currentIndex = util.getIndexById(vm.postId);
				vm.post = util.getPostByIndex(vm.currentIndex);
				vm.$dispatch("set-wx-share", vm.post, vm.post.photo, "single");

				vm.prepareData();
			},

			//预载入
			prepareData () {
				let vm = this;

				vm.isShowDelete = userInfo.uuid === vm.post.user.uuid;
				vm.isShowEdit = vm.isShowDelete;
				vm.isShowReport = !vm.isShowDelete;

				vm.nextPost = util.getNextPost(vm.currentIndex);
				vm.prevPost = util.getPrevPost(vm.currentIndex);

				vm.postId = null;			
			},

			viewTransitionEnd () {
				let vm = this;
				let $list = $(vm.$el).find(".tp-post-img-list");
				
				vm.post = util.getPostByIndex(vm.currentIndex);
				vm.page = vm.post._pageCount;

				vm.isSwipe = false;
				$list.removeClass("transition next prev");

				vm.prepareData();

				vm.isRouterReplace = true;
				config.router.replace({
					name: "postView",
					params: {
						page: vm.page,
						postId: vm.post.id
					}
				});
			},

			appSlideLeft () {
				let vm = this,
					appDownModal = vm.appDownModal;

				if(!appDownModal.isLeft){
					return;
				}

				vm.isSwipe = true;
				appDownModal.classList.last = false;
				appDownModal.classList.first = true;
			},

			appSlideRight () {
				let vm = this,
					appDownModal = vm.appDownModal;

				if(appDownModal.isLeft){
					return;
				}

				vm.isSwipe = true;
				appDownModal.classList.first = false;
				appDownModal.classList.last = true;
			},

			appTransitionEnd () {
				let vm = this;
				let appDownModal = vm.appDownModal;

				vm.isSwipe = false;				
			},

			setInfoToolVisibility () {
				let vm = this;
				vm.isShowInfoTool = !vm.isShowInfoTool;
			},

			setShowInfoToolTimer () {
				let vm = this;
				vm.showInfoToolTimer = setTimeout(() => {
					vm.isShowInfoTool = false;
				}, SHOW_INFO_TOOL_TIMER);
			},

			clearShowInfoToolTimer () {
				let vm = this;
				if(vm.showInfoToolTimer){
					window.clearTimeout(vm.showInfoToolTimer);
					vm.showInfoToolTimer = null;
				}
			}
		},

		events: {
			//删除成功
			"post-img-delete" () {
				let posts = Config.posts;

				posts.data = [];
				posts.reload = true;
				posts.hasNext = false;

				config.router.replace({
					name: "postsList"
				});				
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	@color: #FFF;
	@bgColor: #000;

	@baseZindex: 900;

	@gutter: 20px;
	@largeGutter: 40px;

	@loading: 52px;

	@likeFontSize: 36px;

	@overlayHeight: 87px;
	@toolHeight: 52px;

	@rgba: rgba(0, 0, 0, .5);

	.tp-post-view-wrapper{
		overflow: hidden;
		position: relative;
		background: @bgColor;
		width: @viewpoint-width;

		.tupu-fade-transition{
			transition-duration: 1.4s;
		}		

		.mar-b30{
			margin-bottom: 30px;
		}

		.display-none{
			display: none;
		}

		h1{
			width: 100%;
			height: 100%;
		}

		.tp-photo-caption-wrapper{
			bottom: @overlayHeight - 1;
		}

		.tp-post-view-overlay{
			left: 50%;
			position: fixed;
			background: @rgba;
			box-sizing: border-box;
			width: @viewpoint-width;
			z-index: @baseZindex + 1;
			margin-left: -@viewpoint-width / 2;			
		}

		.tp-post-tool{
			bottom: -1px;
			height: @overlayHeight;
			padding:  (@overlayHeight - @toolHeight)/2 @largeGutter 0;

			.post-like{
				color: @color;
				height: @toolHeight;
				font-size: @likeFontSize;
				line-height: @toolHeight;
			}

			.post-like-count{
				margin-right: 5px;
			}

			.tp-post-tool-list{
				top: (@toolHeight - 44)/2px;

				position: relative;
				
				li{
					width: 46px;
					text-align: center;
					margin-right: 62px;
					height: @toolHeight;
					line-height: @toolHeight;					

					&:last-child{
						margin-right: 0;
					}
				}

				i{
					position: relative;
				}			

				.post-share-white{
					top: 4px;
					position: relative;
				}

				.post-tool-sticky{
					margin-right: 0;
				}
			}			
		}

		.tp-post-img-list{
			height: 100%;
			width: @viewpoint-width * 3;
			transform: translate3d(-@viewpoint-width, 0, 0);

			&.transition{
				transition: transform .6s ease;
			}

			&.prev {
				transform: translate3d(0, 0, 0);
			}

			&.next {
				transform: translate3d(-@viewpoint-width * 2, 0, 0);
			}

			.tp-post-img-item{
				height: 100%;
				position: relative;
				width: @viewpoint-width;

				img{
					top: 50%;
					left: 50%;
					width: @loading;
					height: @loading;
					position: absolute;
					margin-top: -@loading/2;
					margin-left: -@loading/2;										
				}
			}

			.animation-loading{
				animation: loading linear 1s infinite;
			}
		}
	}
</style>