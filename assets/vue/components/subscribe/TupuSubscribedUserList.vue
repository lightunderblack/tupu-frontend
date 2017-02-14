<template>
	<div class="tp-group-user-list-wrapper" :class="className">
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
	import * as Config from "../../common/Config";

	import TupuUserList from "../user/TupuUserList.vue";
	import TupuBottomLoading from "../loading/TupuBottomLoading.vue";

	const API = {
		groups_users: "groups/{{groupId}}/users/"//获取组下所有订阅成员
	};
	const SCROLL_DELAY = 500;
	const $window = $(window);
	const SCROLL_TOP_KEY = "scroll-top-tupu-group-user-list";

	export default {
		name: "TupuSubscribedUserList",

		components: {
			TupuUserList,
			TupuBottomLoading
		},

		props: {
			className: {
				default: "",
				type: String
			},

			users: {
				default: [],
				type: Array,
				twoWay: true
			},

			groupId: {
				default: "",
				type: String
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
			$window.off(".tupuGroupUserList").removeData(SCROLL_TOP_KEY);
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
				Util.request(Util.replaceTpl(API.groups_users, {
					groupId: vm.groupId		
				}), {
					page: page
				}).done(function(data){
					vm.page = page;
					$.each(data.users, (i, item) => {
						vm.users.push(item);
						Util.cacheUser(item);
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
			"load-group-user-list" (reload) {
				let vm = this;
				let scrollTop = 0;

				if(reload){
					vm.loadData(1, true);
				}else{
					scrollTop = $window.data(SCROLL_TOP_KEY);
				}
				$window
					.off("scroll.tupuGroupUserList")
					.on("scroll.tupuGroupUserList", () => vm.scrollLoadData())
					.scrollTop(scrollTop)
					.data(SCROLL_TOP_KEY, 0);
			},

			"reset-group-user-list" (reset) {
				let vm = this;

				if(reset){
					vm.page = 1;
					vm.users = [];
					vm.hasNext = false;
					vm.isShowBottomLoading = false;					
				}
				$window
					.off("scroll.tupuGroupUserList")
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