<template>
	<img class="tp-user-avatar" 
		:class="className" 
		:src="userAvatar | avatar" 
		@click.stop="viewUser(userId)">
</template>

<script>
	import viewUserMixin from "../../mixins/viewUser";

	export default {
		name: "TupuUserAvatar",

		mixins: [
			viewUserMixin
		],

		props: {
			userId: {
				type: [String, Number]
			},

			className: {
				default: "",
				type: String
			},

			userAvatar: {
				default: "",
				type: String
			}
		}
	};
</script>

<style lang="less">
	@radius: 6px;
	@width: 65px;
	@height: 65px;

	.tp-user-avatar{
		width: @width;
		height: @height;
		cursor: pointer;
		border-radius: @radius;
	}		
</style>