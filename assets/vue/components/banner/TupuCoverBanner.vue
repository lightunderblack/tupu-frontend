<template>
	<div class="tp-cover-banner-wrapper">
		<div class="tp-cover-banner text-center">
			<span class="icon-sprite icon-live-icon-red-36 live-icon" v-if="isLiving"></span>
			<img :src="group.cover | cutOut" v-show="group.cover && group.cover.url">
			<h2 class="tp-cover-banner-name">{{group.groupName}}</h2>
		</div>
	</div>
</template>

<script>
	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";

	const MAX_WIDTH = 640;
	const MAX_HEIGHT = 384;
	const config = Config.config;

	export default {
		name: "TupuCoverBanner",

		props: {
			group: {
				type: Object,
				default: {
					cover: {},
					groupName: ""
				}
			},

			isLiving: {
				type: Boolean,
				default: false
			}
		},

		filters: {
			cutOut: function(cover){
				let url = "";

				if(!/^data/.test(cover.url)){
					let width = cover.width;
					let height = cover.height;
					url = Util.replaceTpl(cover.url + "?imageView/2/w/{{width}}/h/{{height}}", {width,height});
				}

				return url;
			}
		},

		watch: {
			"group.cover.url": function(value){
				let cover = this.group.cover;

				if(!/^data/.test(value)){
					let top;
					let width;
					let groupBannerWidth = cover.width;
					let groupBannerHeight = cover.height;
					let height = 640 * groupBannerHeight / groupBannerWidth;

					if(groupBannerWidth/groupBannerHeight >= 640/385){
						top = 0;
						width = "auto";
						height = "100%";
					}else{
						if(height > MAX_HEIGHT){
							top = -(height-MAX_HEIGHT)/2;
						}else{
							top = 0;
						}
						width = "100%";
						height = "auto";						
					}

					$(this.$el).find("img").css({top, width, height});
				}
			}
		}		
	};
</script>

<style lang="less">
	@import "../../../less/base";

	@bannerHeight: 384px;

	.tp-cover-banner{
	    overflow: hidden;
	    position: relative;
	    text-align: center;
	    position: relative;
	    display: table-cell;
	    height: @bannerHeight;
	    vertical-align: middle;
	    width: @viewpoint-width;
	    background-color: #2F5BA3;
	    text-shadow: 1px 4px 4px #5A5555;

	    .live-icon{
	    	top: 20px;
	    	z-index: 2;
	    	right: 20px;
	    	position: absolute;
	    }

	    img{
	    	top: 0;
	    	left: 0;
	    	width: 100%;
	    	position: absolute;
	    }

	    .tp-cover-banner-name{
	    	z-index: 1;
	    	color: #fff;
	        margin: 0 auto;
	        font-size: 40px;
	        max-width: 410px;
	        line-height: 50px;
	        position: relative;
	        font-weight: normal;
	        display: -webkit-box;
	        -webkit-box-align: center;
	        -webkit-box-orient: vertical;
	        text-shadow: 2px 2px 4px #5A5555;
	    }	    
	}
</style>