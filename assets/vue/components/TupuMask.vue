<template>
	<div class="tupu-mask"></div>
</template>

<script>
	export default {
		name: "TupMask"
	};
</script>

<style lang="less">
	.tupu-mask{
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1001;
		position: fixed;
		background: rgba(0, 0, 0, .7);
	}
</style>