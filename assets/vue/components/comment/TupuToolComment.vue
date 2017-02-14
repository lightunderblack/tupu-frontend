<template>
	<i class="icon-sprite" :class="className" @click.stop="getComment">
	</i>
</template>

<script>
	import * as Config from "../../common/Config";

	let config =  Config.config;

	export default {
		name: "TupuToolComment",

		props: {
			post: {
				type: Object
			},

			className: {
				type: String
			}
		},

		methods: {
			getComment () {
				config.router.go({
					params: {
						postId: this.post.id
					},
					name: "postComment"
				});
			}
		}
	};
</script>