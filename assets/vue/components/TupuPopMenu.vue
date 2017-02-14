<template>
	<div class="tupu-pop-menu-wrapper" 
		v-show="isShow" 
		transition="transition">
		<tupu-mask  
			v-show="isShow" 
			v-if="isHashMask" 
			transition="tupu-fade"
			@click="isShow = false">
		</tupu-mask>
		<ul class="tupu-pop-menu" 
			v-show="isShow"
			transition="tupu-pop-menu">
			<slot></slot>
		</ul>
	</div>
</template>

<script>
	import TupuMask from "./TupuMask.vue";
	import createTransition from "../common/createTransition";

	export default {
		name: "TupuPopMenu",

		components: {
			TupuMask
		},

		transitions: {
			transition: createTransition()
		},		

		props: {
			isShow: {
				twoWay: true,
				type: Boolean,
				default: false
			},

			isHashMask: {
				type: Boolean,
				default: true
			}
		}
	};
</script>

<style lang="less">
	@import "../../less/base";

	@bgColor: #FFF;
	@fontColor: #2F5BA3;
	@borderColor: #CECECE;

	.tupu-pop-menu-wrapper{
		left: 50%;
		bottom: 0;
		height: 100%;
		z-index: 1000;
		position: fixed;
		width: @viewpoint-width;
		font-size: @baseFontSize;
		margin-left: -@viewpoint-width / 2;

		.tupu-pop-menu{
			left: 50%;
			margin: 0;
			padding: 0;
			z-index: 1002;
			position: fixed;
			list-style: none;
			background: @bgColor;
			width: @viewpoint-width;
			margin-left: -@viewpoint-width / 2;

			>li{
				border-bottom: 1px solid @borderColor;
				
				&:last-child{
					border-bottom: none;
				}
			}

			a{
				display: block;
				color: @fontColor;
				text-align: center;
				padding: 25px 0 26px;
				text-decoration: none;

				&.warning{
					color: #e60012;
				}
			}

			&-transition{
				bottom: 0;
				transition: bottom ease .5s;	
			}

			&-enter, &-leave{
				bottom: -500px;
			}
		}
	}	
</style>