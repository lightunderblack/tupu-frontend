<template>
	<div class="tupu-pop-tip-wrapper" v-show="isShow" transition="tupu-fade">
		<div class="tupu-pop-tip-icon text-center" v-show="!!iconClassName">
			<i class="icon-sprite" :class="iconClassName"></i>
		</div>
		<div class="tupu-pop-tip-content text-center">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: "TupuPopTip",

		props: {
			isShow: {
				twoWay: true,
				type: Boolean,
				default: false
			},

			iconClassName: {
				type: String,
				default: "icon-check-blue"
			},

			timeOut: {
				type: Number,
				default: 1500
			}
		},

		watch: {
			isShow (val, oldVal) {
				let vm = this;

				if(val === true){
					if(vm.timer){
						window.clearTimeout(vm.timer);
						vm.timer = null;
					}
					vm.timer = setTimeout(() => {
						vm.isShow = false; 
						vm.timer = vm = null;
					}, vm.timeOut);
				}
			}
		}
	};
</script>

<style lang="less">
	@color: #000;
	@bgColor: #FFF;
	@fontSize: 24px;
	@borderColor: #C6C6C6;
	@gutter: 33px 31px 25px;

	.tupu-pop-tip-wrapper{
	    top: 50%;
	    left: 50%;
	    color: @color;
	    z-index: 1010;
	    position: fixed;
	    padding: @gutter;
	    margin-top: -80px;
	    margin-left: -80px;
	    border-radius: 8px;
	    font-size: @fontSize;
	    background: @bgColor;
	    border: 1px solid @borderColor;
	    /*box-shadow: 0px 0px 4px rgba(0, 0, 0, .1);*/

	    .tupu-pop-tip-content{
			margin-top: 20px;
	    }
	}
</style>