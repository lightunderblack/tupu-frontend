<template>
	<div class="tupu-dialog-wrapper" v-show="isShow" transition="transition">
		<tupu-mask
			v-show="isShow"
			v-if="isHasMask"
			transition="tupu-fade">
		</tupu-mask>
		<div class="tupu-dialog" v-show="isShow" transition="tupu-zoom">
			<div class="tupu-dialog-header" v-if="isHasHeader">
				<slot name="header"></slot>	
			</div>
			<div class="tupu-dialog-content" v-if="isHasContent">
				<slot name="content"></slot>	
			</div>
			<div class="tupu-dialog-footer" v-if="isHasFooter">
				<slot name="footer"></slot>	
			</div>			
		</div>
	</div>
</template>

<script>
	import TupuMask from "../TupuMask.vue";
	import createTransition from "../../common/createTransition";

	export default {
		name: "TupuDialog",

		components: {
			TupuMask
		},

		transitions: {
			transition: createTransition()
		},

		props: {
			isHasMask: {
				type: Boolean,
				default: true
			},

			isHasHeader: {
				type: Boolean,
				default: false
			},

			isHasContent: {
				type: Boolean,
				default: true
			},

			isHasFooter: {
				type: Boolean,
				default: true
			},

			isShow: {
				type: Boolean,
				default: false
			}
		}
	};
</script>

<style lang="less">
	@bgColor: #FFF;
	@fontSize: 26px;
	@dialogWidth: 540px;
	@dialogHeight: 200px;
	@buttonBorderColor: #CECECE;

	.tupu-dialog-wrapper{
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		position: fixed;
		font-size: @fontSize;

		.tupu-dialog{
			background: @bgColor;

			&, *{
				box-sizing: border-box;
			}

			&{
				top: 50%;
				left: 50%;
				z-index: 1002;
				position: fixed;
				width: @dialogWidth;
				min-height: @dialogHeight;
				margin-left: -@dialogWidth / 2;
				margin-top: -@dialogHeight / 2;
			}

			&-header{
				
			}

			&-content{
				padding: 50px;
				font-weight: 700;
				text-align: center;
			}

			&-footer{
				overflow: hidden;
				border-top: 1px solid @buttonBorderColor;

				.btn{
					float: left;
					padding: 26px 0;
					text-align: center;
					display: inline-block;

					&:not(:last-child){
						border-right: 1px solid @buttonBorderColor;
					}		
				}

				.btn-warning{
					color: red;
				}

				.btn-primary{
					color: #2F5BA3;
				}
			}
		}
	}

	.tupu-dialog-wrapper.tupu-fade-transition{
		transition-duration: .1s;
	}
</style>