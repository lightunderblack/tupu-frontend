<template>
	<div class="tp-liked-user-list-wrapper">
		<tupu-user-list
			:users="users">
		</tupu-user-list>

		<tupu-bottom-loading 
			v-show="isShowBottomLoading" 
			transition="tupu-loading-fade">
		</tupu-bottom-loading>
	</div>
</template>

<script>
	import $ from "jquery";

	import * as Util from "../../common/Util";

	import TupuUserList from "../user/TupuUserList.vue";
	import TupuBottomLoading from "../loading/TupuBottomLoading.vue";

	const API = {
		posts_likes: "posts/{{postId}}/likes/"
	};
	const $window = $(window);
	const SCROLL_DELAY = 500;	
	const SCROLL_TOP_KEY = "scroll-top-tupu-liked-user-list";

	export default {
		name: "TupuLikedUserList",

		components: {
			TupuUserList,
			TupuBottomLoading
		},

		props: {
			users: {
				default: [],
				type: Array,
				twoWay: true
			},

			postId: {
				type: [String, Number]
			}
		},

		data () {
			return {
				page: 1,
				hasNext: false,
				isShowBottomLoading: false
			}
		},

		//销毁之前要移除事件监听
		beforeDestroy () {
			$window.off(".tupuLikedUserList").removeData(SCROLL_TOP_KEY);
		},

		methods: {
			loadData (page = 1, isFirst = false) {
				let vm = this;

				if(isFirst){
					$window.scrollTop(0);
					vm.$dispatch("show-loading", true);
				}else{
					vm.isShowBottomLoading = true;	
				}
				Util.request(Util.replaceTpl(API.posts_likes, {
					postId: vm.postId		
				}), {
					page: page,
					per_page: 50
				}).done(function(data){
					vm.page = page;
					$.each(data.likes, (i, item) => {
						let user = item.user;
						vm.users.push(user);
						Util.cacheUser(user);
					});
					vm.hasNext = data.pagination && data.pagination.has_next;
				}).fail(function(jqXHR, textStatus){
					
				}).always(function(){
					if(isFirst){
						vm.$dispatch("show-loading", false);
					}else{
						vm.isShowBottomLoading = false;
					}
					vm = null;
				});
			},

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
			"load-liked-user-list" (reload) {
				let vm = this;
				
				if(reload){
					vm.users = [];
					vm.loadData(1, true);
				}else{
					$window.scrollTop($window.data(SCROLL_TOP_KEY));
				}

				$window
					.off("scroll.tupuLikedUserList")
					.on("scroll.tupuLikedUserList", () => vm.scrollLoadData())
					.data(SCROLL_TOP_KEY, 0);
			},

			"reset-liked-user-list" (reset) {
				let vm = this;

				if(reset){
					vm.page = 1;
					vm.users = [];
					vm.hasNext = false;
					vm.isShowBottomLoading = false;					
				}
				$window
					.off("scroll.tupuLikedUserList")
					.data(SCROLL_TOP_KEY, $window.scrollTop())
					.scrollTop(0);
			}
		}
	};
</script>

<style lang="less">
	.tp-group-user-list-wrapper{
		border-bottom: 1px solid #AAA;
	}
</style>