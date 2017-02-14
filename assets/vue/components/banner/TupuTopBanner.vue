<template>
	<div class="tp-top-banner text-center clearfix">
		<a href="#" class="go-back" @click.stop.prevent="goBack" v-if="hasGoBack">返回上页</a>
		<slot name="content"></slot>
	</div>
</template>

<script>
	import * as Config from "../../common/Config";
	
	export default {
		name: "TupuTopBanner",

		props: {
			hasGoBack: {
				default: true,
				type: Boolean
			},

			isGoBackReload: {
				type: Boolean,
				default: false
			}	
		},

		methods: {
			goBack () {
				window.history.go(-1);
				if(this.isGoBackReload){
					Config.posts.reload = true;
				}
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";
	
	@height: 105px;
	@borderBottomColor: #AAA;

    .tp-top-banner{
        top: 0;
        left: 50%;
        z-index: 100;
        padding: 0 20px;
        height: @height;
        font-size: 32px;
        position: fixed;
        background: #FFF;
        line-height: @height;
        box-sizing: border-box;
        width: @viewpoint-width;
        margin-left: -(@viewpoint-width / 2);
        border-bottom: 1px solid @borderBottomColor;

        .go-back{
            top: 0;
            left: 0;
            width: 50px;
            color: #2F5BA3;
            font-size: 24px;
            line-height: 25px;
            position: absolute;
            padding: 28px 20px;
        }

		.share-icon{
    		top: 8px;
    		right: 18px;
			position: relative;
		}

		.share-mark-icon{
			top: 31px;
			right: 37px;
            position: absolute;
		}               
    }		
</style>