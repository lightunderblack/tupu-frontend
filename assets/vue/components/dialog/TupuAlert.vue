<template>
	<tupu-dialog 
		class="tupu-alert" 
		:class="className"
		:is-show="isShow">
		<template slot="content">
			<slot></slot>
		</template>
		<template slot="footer">
			<a href="#" class="btn" @click.prevent="ok($event)">{{btnText}}</a>
		</template>
	</tupu-dialog>
</template>

<script>
	import TupuDialog from "./TupuDialog.vue";

	export default {
		name: "TupuAlert",

		components: {
			TupuDialog	
		},

		props: {
			className: {
				type: [String, Array]
			},

			btnText: {
				type: String,
				default: "确定"
			},

			isShow: {
				twoWay: true,
				type: Boolean,
				default: false
			}
		},

		methods: {
			ok (event) {
				let vm = this;
				vm.isShow = false;
				vm.$dispatch("tupu-alert-ok", event, vm);
			}
		}
	};
</script>

<style lang="less">
	.tupu-alert{
		.btn{
			width: 100%;
		}	
	}	
</style>