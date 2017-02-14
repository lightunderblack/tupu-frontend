<template>
	<div class="tp-container-wrapper tp-subscribe-success-wrapper">
		<tupu-top-banner 
			:has-go-back="true"
			:is-go-back-reload="true">
			<template slot="content">订阅成功</template>
		</tupu-top-banner>

	    <div class="tp-container-info tp-subscribe-success">
	    	<img :src="qrcodeUrl" width="640">
	    </div>
	</div>	
</template>

<script>
	import * as Config from "../../common/Config";
	import TupuTopBanner from "../banner/TupuTopBanner.vue";

	export default {
		name: "TupuSubscribeSuccess",

		components: {
			TupuTopBanner
		},		

		data () {
			return {
				qrcodeUrl: Config.config.emptyImg 
			};
		},

		route: {
			data () {
				let vm = this;

				$(window).scrollTop(0);
				vm.$dispatch("set-wx-share");
				vm.$dispatch("show-loading", false);
				vm.qrcodeUrl = Config.qiniuInfo.https_domain + "img/check&QRcodeX2.jpg";
			}
		}
	};
</script>

<style lang="less">
	.tp-subscribe-success-wrapper{
		background: #FFF;
	}
</style>
