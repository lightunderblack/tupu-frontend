<template>
	<div class="tupu-like-animation" 
		v-show="isShow" 
		transition="tupu-like">
	</div>
</template>

<script>
	export default {
		name: "TupuLikeAnimation",

		props: {
			isShow: {
				twoWay: true,
				type: Boolean,
				default: false
			}
		},

		watch: {
			isShow (val, oldVal){
				let vm = this;

				if(val === true){
					window.clearTimeout(vm.transitionTimer);
					vm.transitionTimer = window.setTimeout(() => {
						vm.isShow = false;
						vm = null;
					}, 1000);
				}
			}	
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	.tupu-like{
		&-transition{
		    top: 50%;
		    left: 50%;
		    width: 151px;
		    height: 142px;	       
		    z-index: 10000;
		    position: fixed;
		    margin-top: -70px;
		    margin-left: -76px;	    	    	    
		    background: url("@{imgPath}/heart.png") no-repeat 0 0;	
		}

		&-enter{
			animation: scaleToFadeIn linear 1s 1;
		}

		&-leave{
			animation: scaleToFadeOut linear 0.4s 1;
		}				
	}
</style>