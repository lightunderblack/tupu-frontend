<template>
	<div class="tupu-unfollow-footer" @click.stop="goCreateAlbum">
		创建自己的相册，快速分享海量照片 <a href="#" class="btn-create-album text-center" @click.stop.prevent="goCreateAlbum">+ 创建</a>
	</div>
</template>

<script>
	import * as Config from "../../common/Config";

	export default {
		name: "TupuUnfollowFooter",

		methods: {
			goCreateAlbum () {
				Config.config.router.go({
					name: "createAlbum"
				})
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	@radius: 4px;
	@gutter: 40px;
	@height: 105px;
	@bgColor: #FFF;

	.tupu-unfollow-footer{
		bottom: 20px;
		color: #2F5BA3;
		height: @height;
		font-size: 24px;
		cursor: pointer;
		text-indent: 40px;
		position: relative;
		margin: 20px 20px 0;
		background: @bgColor;
		line-height: @height;
		border-radius: @radius;

		.btn-create-album{
			top: 30px;
			right: 40px;
			color: #FFF;
			width: 80px;
			height: 45px;
			text-indent: 0;
			font-size: 20px;
			line-height: 45px;
			border-radius: 4px;
			position: absolute;
			background: #2F5BA3;
		}
	}
</style>