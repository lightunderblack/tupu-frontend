<template>
	<div class="tupu-unsubscribe-footer text-center">
		<img :src="unsubscribeImg" width="600">	
	</div>
</template>

<script>
	import * as Config from "../../common/Config";

	export default {
		name: "TupuUnsubscribeFooter",

		props: {
			unsubscribeImg: {
				type: String,
				default: Config.config.emptyImg 
			}	
		}
	};
</script>

<style lang="less">
	.tupu-unsubscribe-footer{
		bottom: 20px;
		position: relative;
	}
</style>