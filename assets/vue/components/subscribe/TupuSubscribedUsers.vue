<template>
	<div class="tp-subscribe-user-wrapper tp-container-wrapper">
		<tupu-top-banner 
			:has-go-back="true"
			:is-go-back-reload="isGoBackReload">
			<template slot="content">相册信息（<span>{{users.length}}</span>人）</template>
		</tupu-top-banner>

		<div class="tp-container-info">
			<tupu-subscribed-user-list 
				:group-id="groupId" 
				:users.sync="users">
			</tupu-subscribed-user-list>

			<tupu-download-app-link></tupu-download-app-link>

			<a href="#" 
				v-show="isSubscribed" 
				class="cancel-subscribe-btn" 
				@click.stop.prevent="toCancelSubscribe">取消订阅</a>			
		</div>

		<tupu-confirm
			@tupu-confirm-ok="cancelSubscribeGroup(groupId, userInfo.id)"
			class-name="cancel-subscribe-dialog"
			:is-show.sync="isShowCancelSubscribe"
			cancel-btn-class="btn-primary"
			ok-btn-class="btn-primary"
			ok-btn-text="不再订阅">
			<h1>不再订阅吗？</h1>
			<p>取消订阅后将不再收到此相册内容</p>
		</tupu-confirm>
	</div>
</template>

<script>
	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";

	import cancelSubscribeGroupMixin from "../../mixins/subscribe/cancelSubscribeGroup";

	import TupuConfirm from "../dialog/TupuConfirm.vue";
	import TupuTopBanner from "../banner/TupuTopBanner.vue";
	import TupuSubscribedUserList from "./TupuSubscribedUserList.vue";
	import TupuDownloadAppLink from "../downloadApp/TupuDownloadAppLink.vue";

	let util = {
		getIndex (users, user) {
			return Util.getIndexById(users, user.id);
		},

		isSubscribed (users, user) {
			return !!(~util.getIndex(users, user));
		}
	};

	export default {
		name: "TupuSubscribedUsers",

		mixins: [
			cancelSubscribeGroupMixin
		],

		components: {
			TupuConfirm,
			TupuTopBanner,
			TupuDownloadAppLink,
			TupuSubscribedUserList
		},

		data () {
			return {
				users: [],
				groupId: "",
				userInfo: {},

				isSubscribed: false,
				isGoBackReload: false,
				isShowCancelSubscribe: false
			};
		},

		watch: {
			"users" (val, oldVal) {
				let vm = this;
				let isSubscribed = false;
				let userInfo = vm.userInfo;

				if((val || []).length){
					if(userInfo.id != val[0].id){
						isSubscribed = util.isSubscribed(val, userInfo);
					}
				}
				vm.isSubscribed = isSubscribed;
			}	
		},

		route: {
			data ({to, from}) {
				let vm = this;

				$(window).scrollTop(0);
				vm.$dispatch("set-wx-share");
				vm.groupId = to.params.groupId;
				vm.userInfo = $.extend(true, {}, Config.userInfo);
				if(!({userView: 1})[from.name]){
					vm.$nextTick(() => {
						vm.$broadcast("load-group-user-list", true);//载入组成员列表
						vm = null;
					});
				}
			},

			deactivate (transition) {
				let vm = this;

				vm.$broadcast("reset-group-user-list", !({userView: 1})[transition.to.name]);//重置组成员列表
				transition.next();
			}
		},

		methods: {
			toCancelSubscribe () {
				this.isShowCancelSubscribe = true;
			}
		},

		events: {
			"cancel-subscribe-group" () {
				let vm = this;
				let users = vm.users;

				vm.isGoBackReload = true;
				vm.isShowCancelSubscribe = false;
				users.splice(util.getIndex(users, vm.userInfo), 1);
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	.cancel-subscribe-dialog{
		.tupu-dialog{
			border-radius: 6px;
		}

		.tupu-dialog-content {
			padding: 22px;
			font-weight: normal;

			h1{
				color: #000;
				font-size: 30px;
				margin-bottom: 26px;
			}

			p{
				font-size: 24px;
			}			
		}

		.tupu-dialog-footer{
			.btn{
				padding: 18px 0;
			}
		}
	}

	.tp-subscribe-user-wrapper{
		.cancel-subscribe-btn{
			height: 95px;
			display: block;
			color: #E60012;
			margin: 40px 0;
			font-size: 26px;
			padding: 0 20px;
			background: #FFF;
			line-height: 95px;
		}
	}
</style>