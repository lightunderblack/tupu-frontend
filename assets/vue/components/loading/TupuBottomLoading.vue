<template>
	<div class="tupu-bottom-loading clearfix">
		<span class="square square1"></span>
		<span class="square square2"></span>
		<span class="square square3"></span>
		<span class="square square4"></span>		
	</div>	
</template>

<script>
	export default {
		name: "TupuBottomLoading"
	};
</script>

<style lang="less">
	.tupu-bottom-loading {
		width: 52px;
		height: 52px;
		margin: 20px auto 30px auto;

		.square {
			float: left;
		    width: 23px;
	        height: 23px;	
		}

		.square1, .square3 {
		    margin-right: 5px;
		    margin-bottom: 5px;		
		    animation: square1 0.4s infinite;
		}

		.square3 {
		    animation: square3 0.4s infinite;
		}	

		.square2 {
		    animation: square2 0.4s infinite;
		}

		.square4 {
		    animation: square4 0.4s infinite;
		}
	}		
</style>