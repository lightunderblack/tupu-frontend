<template>
	<div class="tupu-loading" v-show="isShow" transition="tupu-fade">
		<img :src="url">
	</div>
</template>

<script>
	export default {
		name: "TupuLoading",

		props: {
			isShow: {
				type: Boolean,
				default: false
			},

			url: {
				type: String
			}
		}
	};
</script>

<style lang="less">
	.tupu-loading{
	    top: 50%;
	    left: 50%;
	    width: 52px;
	    height: 52px;
	    padding: 20px;
	    z-index: 10000;
	    position: fixed;
	    margin-top: -46px;
	    margin-left: -46px;    
	    border-radius: 4px;
	    background: #FFF;
	    border-radius: 4px;  
	}	
</style>