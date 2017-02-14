<template>
	<ul class="tp-user-list-wrapper clearfix">
		<li class="tp-left text-center"
			track-by="id"
			v-for="user in users">
			<tupu-user-avatar
				:user-id="user.id"
				:user-avatar="user.headimgurl | avatar">
			</tupu-user-avatar>
			<p class="ellipsis">{{user.nickname}}</p>
		</li>
	</ul>
</template>

<script>
	import * as Config from "../../common/Config";

	import TupuUserAvatar from "../user/TupuUserAvatar.vue";

	export default {
		name: "TupuUserList",

		components: [
			TupuUserAvatar
		],

		props: {
			users: {
				type: Array,
				default: []
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	@width: 102px;
	@height: 102px;
	@bgColor: #FFF;

	.tp-user-list-wrapper{
		padding: 10px 8px 40px;
		box-sizing: border-box;
		background-color: @bgColor;

		li{
			width: @width;
			color: #2F58A3;
			font-size: 20px;
			padding: 30px 27px 0;
		}

		.tp-user-avatar{
			width: @width;
			height: @height;
			border-radius: 4px;
			margin-bottom: 14px;
		}
	}
</style>