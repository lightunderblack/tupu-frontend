<template>
	<div class="tp-container-wrapper tp-create-album-wrapper">
		<tupu-top-banner 
			:has-go-back="true">
			<template slot="content">前往图扑相册</template>
		</tupu-top-banner>

	    <div class="tp-container-info">
	    	<img :src="qrcodeUrl" width="640">
	    </div>
	</div>	
</template>

<script>
	import * as Config from "../../common/Config";
	import TupuTopBanner from "../banner/TupuTopBanner.vue";

	export default {
		name: "TupuCreateAlbum",

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
				vm.qrcodeUrl = Config.qiniuInfo.https_domain + "img/qrcode_page_creative.jpg";
			}
		}
	};
</script>

<style lang="less">
	.tp-create-album-wrapper{
		background: #FFF;
	}
</style>
