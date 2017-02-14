<template>
	<div class="tp-list-wrapper">
		<ul class="tp-list clearfix">
			<tupu-post-list-item 
				v-for="post in posts" 
				:post="post"
				:has-next="hasNext"
				track-by="id">
			</tupu-post-list-item>
		</ul>

		<tupu-bottom-loading 
			v-show="isShowBottomLoading"
			transition="tupu-loading-fade">
		</tupu-bottom-loading>
	</div>
</template>

<script>
	import $ from "jquery";

	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";

	import TupuPostListItem from "./TupuPostListItem.vue";
	import TupuBottomLoading from "../loading/TupuBottomLoading.vue";

	let util = {
		isToScrollLoading () {
			return (document.documentElement.scrollHeight 
				- ($window.scrollTop() + document.body.clientHeight)) < 50;
		}
	};

	const SCROLL_DELAY = 500;
	const $window = $(window);
	const config = Config.config;
	const API = {
		groups_posts: "groups/{{groupId}}/posts/"//获取组下照片
	};	

	export default {
		name: "TupuList",

		components: {
			TupuPostListItem,
			TupuBottomLoading
		},

		data () {
			return {
				page: 1,
				posts: [],//图片集
				isInit: false,
				hasNext: false,//是否有下一页
				scrollLoadTimer: null,//滚动加载定时器
				isShowBottomLoading: false//是否显示加载图标
			};
		},

		created () {
			let vm = this;

			vm.loadData(1, true);//载入数据
			$window.on("scroll.tupuPostList", ()=> vm.scrollLoadData());//绑定滚动加载事件
		},

		//销毁之前要移除事件监听
		beforeDestroy () {
			this.isInit = false;
			$window.off(".tupuPostList");
		},

		methods: {
			//载入数据
			loadData (page = 1, isFirst = false){
				let vm = this;

				if(isFirst){
					$window.scrollTop(0);
				}else{
					vm.isShowBottomLoading = true;	
				}

				Util.request(Util.replaceTpl(API.groups_posts, {
					groupId: config.groupId		
				}), {
					page: page,
					compact: true	
				}).done(function(data){
					if(isFirst){
						vm.isInit = true;
						vm.$dispatch("set-group", data.group);
						vm.$dispatch("set-wx-share", data.group, data.posts[0].photo);
					}else{
						vm.$dispatch("set-wx-share");
					}

					$.each(data.posts, (i, item) => {
						item._pageCount = page;
						vm.posts.push(item);
					});
					vm.page = page;
					vm.hasNext = data.pagination && data.pagination.has_next;
				}).fail(function(jqXHR, textStatus){

				}).always(function(){
					if(!isFirst){
						vm.isShowBottomLoading = false;
					}
					vm.$dispatch("set-loading", false);
					vm = null;
				});	
			},

			//滚动加载
			scrollLoadData () {
				let vm = this;

				if(!vm.hasNext 
						|| vm.isShowBottomLoading 
							|| !util.isToScrollLoading()){
					return;
				}

				vm.isShowBottomLoading = true;
				if(vm.scrollLoadTimer){
					clearTimeout(vm.scrollLoadTimer);
					vm.scrollLoadTimer = null;
				}

				vm.scrollLoadTimer = setTimeout(() => vm.loadData(vm.page + 1), SCROLL_DELAY);
			}
		},

		events: {
			"post-list-route" (name, transition) {
				let vm = this;
				let to = transition.to;
				let key = "tp-post-list-scroll-top";

				if(name === "activate") {
					let reload = Config.posts.reload;
					if(reload){
						$window.scrollTop(0);
						vm.posts = [];
						Config.posts.reload = false;
						vm.$dispatch("set-loading", true);//显示加载图标
						vm.loadData(1, true);//重载数据							
					}else{
						if(vm.isInit){
							vm.$dispatch("set-wx-share");
							setTimeout(() => $window.scrollTop($window.data(key) || 0), 10);	
						}
					}

					if(vm.isInit){
						$window
							.off("scroll.tupuPostList")
							.on("scroll.tupuPostList", () => vm.scrollLoadData());
					}
				}else if(name === "deactivate") {
					if(transition.to.name === "postView"){
						let posts = Config.posts;
						posts.data = vm.posts;//缓存post数据用于单页浏览使用
						posts.hasNext = vm.hasNext;//标识是否有下一页
					}
					$window.off("scroll.tupuPostList").data(key, $window.scrollTop());//移除滚动加载事件
				}
			}
		}
	};	
</script>

<style lang="less">
	.tp-list-wrapper{
	    padding: 20px 0 0 20px;
	}
</style>