<template>
	<div class="tupu-subscribed-footer text-center">
		<tupu-download-app-link
			icon-class-name="icon-download-white">
		</tupu-download-app-link>
		<p>最好用的社交云相册，海量储存高清照片</p>
	</div>
</template>

<script>
	import TupuDownloadAppLink from "../downloadApp/TupuDownloadAppLink.vue";

	export default {
		name: "TupuSubscribedFooter",

		components: {
			TupuDownloadAppLink
		}
	};
</script>

<style lang="less">
	.tupu-subscribed-footer{
	    width: 100%;
	    background: #E4E4E4;
	    box-sizing: border-box;
	    padding: 20px 20px 40px;

	    p{
	    	color: #5A5555;
		    font-size: 32px;
		    line-height: 32px;	    	
	    }

	    .tp-download-app-link{
	    	color: #FFF;
	    	font-size: 32px;
	    	margin-bottom: 20px;
	    	border-radius: 10px;
	    	background-color: #2F5BA3;	
	    }
	}
</style>