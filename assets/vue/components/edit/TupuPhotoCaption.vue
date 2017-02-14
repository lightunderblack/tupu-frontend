<template>
	<div class="tp-photo-caption-wrapper">
		<div class="tp-photo-caption-container" 
			:class="{'expand-caption': isExpandCaption}">
			<i v-show="isShowCaptionMore"
				@click.stop="toggleCaption"
				class="icon-sprite caption-more-icon"
				:class="isExpandCaption ? 'icon-more-down-white-40' : 'icon-more-up-white-40'"></i>
			<div class="tp-photo-caption word-break"
				:class="{ellipsis : !isExpandCaption && isShowCaptionMore}">{{caption}}</div>
		</div>
		<div class="caption-test-overflow word-break">{{caption}}</div>		
	</div>	
</template>

<script>
	const GUTTER = 40;
	const MAX_HEIGHT = 310;
	const VIEW_POINT_WIDTH = 640;
	const CAPTION_HEIGHT = 70 - 40;

	export default {
		name: "TupuPhotoCaption",

		data () {
			return {
				isExpandCaption: false,
				isShowCaptionMore: false
			};
		},

		props: {
			caption: {
				default: "",
				type: String
			}
		},

		ready () {
			let vm = this;
			let $element = $(vm.$el);

			vm.$captionContainer = $element.find(".tp-photo-caption");
			vm.captionOverflow = $element.find(".caption-test-overflow")[0];
		},

		watch: {
			caption (val, oldVal){
				let vm = this;
				vm.$nextTick(() => {
					vm.setIsShowCaptionMore();
				});	
			}	
		},

		methods: {
			toggleCaption () {
				let vm = this;

				vm.setHeight((vm.isExpandCaption = !vm.isExpandCaption));
			},

			setHeight (isExpand) {
				let vm = this;
				let captionOverflow = vm.captionOverflow;
				let $captionContainer = vm.$captionContainer;

				if(isExpand){
					$captionContainer.height(Math.min(captionOverflow.scrollHeight - GUTTER, MAX_HEIGHT));
				}else{
					$captionContainer.height(CAPTION_HEIGHT);	
				}
			},

			setIsShowCaptionMore () {
				let vm = this;
				let captionOverflow = vm.captionOverflow;

				vm.isExpandCaption = false;
				vm.setHeight(vm.isExpandCaption);
				vm.isShowCaptionMore = captionOverflow.scrollHeight > captionOverflow.clientHeight;
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";
	@color: #FFF;
	@gutter: 20px;
	@descHeight: 70px;
	@descFontSize: 28px;
	@descLineHeight: 28px;

	.tp-photo-caption-container{
		margin: 0 @gutter;
		position: relative;
		border-bottom: 2px solid rgba(255, 255, 255, .3);

		.ellipsis{
			padding-right: @gutter + 44;
		}
	}

	.expand-caption{
		padding-top: 73px;

		.caption-more-icon{
			top: 15px;
		}

		.tp-photo-caption{
			overflow-y: auto;
		}
	}	

	.caption-more-icon{
		top: 16px;
		right: 20px;
		position: absolute;
	}		

	.tp-photo-caption{
		color: @color;
		padding: @gutter;
		height: @descHeight;
		box-sizing: border-box;
		font-size: @descFontSize;
		line-height: @descLineHeight;	
	}

	.caption-test-overflow{
		z-index: -1;
		padding: @gutter;
		overflow: hidden;
		position: absolute;
		visibility: hidden;
		height: @descHeight;
		box-sizing: border-box;
		font-size: @descFontSize;
		line-height: @descLineHeight;
		width: @viewpoint-width - @gutter * 2;
	}

</style>