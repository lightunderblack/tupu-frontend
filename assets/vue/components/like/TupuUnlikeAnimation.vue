<template>
	<div class="text-center tupu-unlike-transition" :class="className" v-show="isShow">
		<!--<span class="tupu-unlike-icon tupu-unlike-heart" 
			v-show="isShow" 
			transition="unlike-heart"
			@transitionend="heartTranstionEnd"></span>-->
		<span class="tupu-unlike-icon tupu-unlike-left-heart" v-show="isShow" transition="unlike-left-heart"></span>
		<span class="tupu-unlike-icon tupu-unlike-right-heart" v-show="isShow" transition="unlike-right-heart"></span>
	</div>
</template>

<script>
	export default {
		name: "TupuUnlikeAnimation",

		data () {
			return {
				transitionTimer: null
			};
		},

		props: {
			isShow: {
				twoWay: true,
				type: Boolean,
				default: false
			},
			
			className: {
				type: String
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
					}, 800);
				}
			}
		},

		methods: {
			/*heartTranstionEnd () {
				$(this.$el).find(".tupu-unlike-heart").hide();
			}*/
		}
	};

</script>

<style lang="less">
	@import "../../../less/base.less";

	.tupu-unlike{
		&-transition{
			top: 50%;
			left: 50%;
			width: 600px;
			height: 160px;
			position: fixed;
			z-index: 10000;
			line-height: 300px;
			margin-top: -80px;
			margin-left: -300px;
		}

		&-heart{
			top: 50%;
			left: 50%;
			width: 152px;
	    	height: 142px; 
	    	margin-top: -71px;
	    	margin-left: -74px;  
	    	position: absolute; 	
	    	background: url('@{imgPath}/heart.png') no-repeat center center;
		}

		&-left-heart, &-right-heart{
			width: 92px;
			height: 140px;
		}

		&-left-heart{
			margin-right: -18px;
			background: url('@{imgPath}/broken_heart_left.png') no-repeat center center;
		}

		&-right-heart{
			margin-left: -14px;
			background: url('@{imgPath}/broken_heart_right.png') no-repeat center center;
		}
	}

	.unlike-heart{
		&-transition{
			display: inline-block;
			transition: opacity .8s ease;				
		}

		&-enter{
			opacity: 0;	
		}
	}

	.unlike-left-heart{
		&-transition{
			opacity: 0;
			display: inline-block;			
		}

		&-enter{
			animation: breakHeartLeft 1s linear;	
		}			
	}

	.unlike-right-heart{
		&-transition{
			opacity: 0;
			display: inline-block;			
		}

		&-enter{
			animation: breakHeartReft 1s linear;
		}		
	}	
</style>