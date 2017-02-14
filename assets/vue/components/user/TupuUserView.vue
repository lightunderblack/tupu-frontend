<template>
	<div class="tp-user-view-wrapper tp-container-wrapper">
		<tupu-top-banner 
			:has-go-back="true">
			<template slot="content">个人信息</template>
		</tupu-top-banner>

	    <div class="tp-container-info">
	    	<div class="tp-user-info-wrapper">
		    	<p class="tp-user-avatar-wrapper text-center">
		    		<img :src="user.headimgurl | avatar">
		    	</p>
		    	<p class="tp-user-nickname text-center ellipsis">{{user.nickname}}</p>
		    	<p class="tp-user-gender text-center" :style="{visibility: gender ? 'visible' : 'hidden'}">
		    		<i class="icon-sprite" :class="gender"></i>
		    	</p>
		    	<p class="tp-user-address text-center">
		    		<i class="icon-sprite icon-city-icon-gary location"></i><span>{{adress}}</span>
		    	</p>	    		
	    	</div>
	    	<tupu-download-app-link></tupu-download-app-link>
	    </div>
	</div>
</template>

<script>
	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";

	import TupuTopBanner from "../banner/TupuTopBanner.vue";
	import TupuDownloadAppLink from "../downloadApp/TupuDownloadAppLink.vue";

	export default {
		name: "TupuUserView",

		components: {
			TupuTopBanner,
			TupuDownloadAppLink
		},

		data () {
			return {
				user: {},
				isShowGender: false
			};
		},

		computed: {
			adress () {
				let city = $.trim(this.user.city);
				let province = $.trim(this.user.province);
				return !province && !city ? "未知" : [province, city].join(""); 	
			},

			gender () {
				return ({1: "icon-male", 2: "icon-female"})[this.user.sex] || "";
			}
		},

		route: {
			data ({to}) {
				let vm = this;
				
				$(window).scrollTop(0);
				vm.$dispatch("set-wx-share");
				vm.$dispatch("show-loading", false);
				vm.user = Util.getUserFormCacheById(to.params.userId);
			},

			deactivate (transition) {
				this.resetData();
				transition.next();	
			}
		},

		methods: {
			resetData () {
				this.user = {};
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	.tp-user-view-wrapper{
	   .tp-container-info{
	    	background: #FFF;
	    }

	    .tp-user-info-wrapper{
	    	padding-left: 20px;
	    	padding-right: 20px;
	    	border-bottom: 1px solid #AAA;	    	
	    }

	    .tp-user-avatar-wrapper{
	    	padding-top: 70px;
	    	margin-bottom: 30px;

	    	img{
	    		width: 320px;
	    		height: 320px;
	    		border-radius: 8px;
	    	}
	    }

	    .tp-user-nickname{
	    	color: #5A5555;
	    	font-size: 32px;
	    }

	    .tp-user-gender{
	    	margin: 37px 0;
	    }

	    .tp-user-address{
	    	color: #AAA;
	    	font-size: 26px;
	    	margin-top: 20px;
	    	margin-bottom: 20px;
	    }

	    .location{
	    	top: 4px;
	    	position: relative;
	    	margin-right: 10px;
	    }
	}
</style>