<template>
	<div class="tp-download-app-modal">
		<div class="text-right mar-b30">
			<i class="icon-sprite icon-cancel-gray" @click.stop="goBack"></i>
		</div>

		<div class="text-center mar-b30">
			<i class="icon-sprite icon-logo-129"></i>
		</div>

		<p class="text-center slogan">图扑，最好用的社交云相册</p>
		<div class="text-center">
			<p class="intro">高速上传高清照片<br>海量空间永久储存</p>
		</div>

		<div class="text-center">
			<tupu-download-app-link content="点击安装APP"></tupu-download-app-link>
		</div>
		
		<div class="text-center tp-post-app-img">
			<img :src="appDownloadImg" v-set-app-img-size>
		</div>		
	</div>
</template>

<script>
	import * as Config from "../../common/Config";
	import TupuDownloadAppLink from "./TupuDownloadAppLink.vue";

	export default {
		name: "TupuDownloadAppModal",

		components: {
			TupuDownloadAppLink	
		},

		props: {
			appDownloadImg: {
				type: String,
				default: Config.config.emptyImg
			}	
		},

		directives : {
			"set-app-img-size" () {
				$(window).height() < 900  && $(this.el).width(260);
			}
		},

		methods: {
			goBack () {
				window.history.go(-1);
			}
		}	
	};
</script>

<style lang="less">
	@import "../../../less/base";

	@baseZindex: 900;

	.tp-download-app-modal{
		top: 0;
		left: 50%;
		height: 100%;
		padding: 20px;		
		overflow: hidden;
		position: absolute;		
		box-sizing: border-box;
		width: @viewpoint-width;
		z-index: @baseZindex + 2;
		transform: translate3d(0, 0, 0);
		margin-left: -@viewpoint-width / 2;
		background: #FFF;
		
		&.transition{
			transition: transform .6s ease;
		}

		&.first{
			transform: translate3d(-@viewpoint-width, 0, 0);
		}

		&.last{
			transform: translate3d(@viewpoint-width, 0, 0);
		}

		.slogan{
			font-size: 24px;
			color: #2F5BA3;	
		}

		.intro{
			color: #000;
			font-size: 36px;
			line-height: 46px;
			margin-top: 50px;
			margin-bottom: 60px;
		}

		.tp-download-app-link{
			height: auto;
			color: #2F5BA3;
			font-size: 24px;
			line-height: 1em;		
			border-radius: 10px;
			display: inline-block;
			padding: 16px 40px 24px;
			border: 2px solid #2F5BA3;

			i{
				top: 6px;
			}
		}

		.tp-post-app-img{
			bottom: 0;
			left: 20px;
			right: 20px;
			position: absolute;
		}
	}
</style>