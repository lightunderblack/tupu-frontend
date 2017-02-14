<template>
	<tupu-dialog 
		class="tupu-confirm" 
		:class="className" 
		:is-show="isShow">
		<template slot="content">
			<slot></slot>	
		</template>
		<template slot="footer">
			<a href="#" class="btn" :class="okBtnClass" @click.stop.prevent="ok($event)">{{okBtnText}}</a>
			<a href="#" class="btn" :class="cancelBtnClass" @click.stop.prevent="cancel($event)">{{cancelBtnText}}</a>			
		</template>
	</tupu-dialog>
</template>

<script>
	import TupuDialog from "./TupuDialog.vue";

	export default {
		name: "TupuConfirm",

		components: {
			TupuDialog	
		},

		props: {
			className: {
				type: [String, Array]
			},

			isShow: {
				twoWay: true,
				type: Boolean,
				default: false
			},

			okBtnClass: {
				type: String
			},

			okBtnText: {
				type: String,
				default: "确定"
			},

			cancelBtnClass: {
				type: String
			},

			cancelBtnText: {
				type: String,
				default: "取消"
			}
		},

		methods: {
			ok (event) {
				let vm = this;
				vm.$dispatch("tupu-confirm-ok", event, vm);
			},

			cancel (event) {
				let vm = this;
				vm.isShow = false;
				vm.$dispatch("tupu-confirm-cancel", event, vm);
			}
		}
	};
</script>

<style lang="less">
	.tupu-confirm{
		.btn{
			width: 50%;
		}	
	}
</style>