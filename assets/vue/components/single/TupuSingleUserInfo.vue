<template>
	<div class="tp-single-user-info-wrapper clearfix">
		<a href="#" class="btn-back-opacity text-left" @click.stop.prevent="goBack">
			<i class="icon-sprite icon-back-opacity"></i>
		</a>
		<tupu-user-avatar 
			:user-id="user.id"
			class-name="tp-left"
			:user-avatar="user.headimgurl">
		</tupu-user-avatar>
		<div class="tp-post-author">
			<p class="author-name ellipsis">{{user.nickname}}</p>
			<p class="post-time">{{created | timeHandler}}</p>
		</div>
	</div>
</template>

<script>
	import TupuUserAvatar from "../user/TupuUserAvatar.vue";

	export default {
		name: "TupuSingleUserInfo",

		components: {
			TupuUserAvatar
		},

		props: {
			created: {
				default: "",
				type: String
			},

			user: {
				type: Object,
				default: {
					nickname: "",
					headimgurl: ""
				}
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

	@color: #FFF;

	@gutter: 20px;

	@avatarWidth: 60px;
	@avatarHeight: 60px;
	@goBackWidth: 70px;
	@goBackIconHeight: 36px;

	@overlayHeight: 87px;

	@postTimeFontSize: 18px;
	@authorNameFontSize: 26px;

	@postTimeLineHeight: 22px;
	@authorNameLineHeight: 27px;

	.tp-single-user-info-wrapper{
		top: 0;
		padding: 14px @gutter 13px @gutter;

		.btn-back-opacity{
			top: 0;
			left: 0;
			z-index: 10;
			position: absolute;
			width: @goBackWidth;
			height: @overlayHeight;
			line-height: @overlayHeight;

			i{
				top: 50%;
				left: 20px;
				margin-top: -18px;
				position: absolute;
			}
		}

		.tp-post-author{
			top: 4px;
			color: @color;
			position: relative;
			padding-left: @goBackWidth + @avatarWidth + 10;
		}

		.tp-user-avatar{
			z-index: 2;
			position: relative;
			border-radius: 8px;
			width: @avatarWidth;
			height: @avatarHeight;
			margin-left: @goBackWidth - @gutter + 10;
		}

		.author-name{
			margin-bottom: 5px;
			height: @authorNameLineHeight;
			font-size: @authorNameFontSize;
			line-height: @authorNameLineHeight;
		}

		.post-time{
			height: @postTimeLineHeight;
			font-size: @postTimeFontSize;
			line-height: @postTimeLineHeight;				
		}			
	}
</style>