<template>
	<i class="icon-sprite" 
		@click.stop="setLike($event)"
		:class="[className, post.liked ? likedClassName : likeClassName]">
	</i>
</template>

<script>
	import * as Util from "../../common/Util.js";

	let API = {
		posts_likes: "posts/{{postId}}/likes/"//标注照片是否赞
	};

	export default {
		name: "TupuToolLike",

		props: {
			post: {
				type: Object
			},

			className: {
				type: String
			},

			likeClassName: {
				type: String,
				default: "icon-like-whiteline"
			},

			likedClassName: {
				type: String,
				default: "icon-liked-full-shadow"
			}
		},

		methods: {
			setLike () {
				let vm = this;

				vm.post.liked ? vm.unlike() : vm.like();
				vm.$dispatch("post-tool-set-like", !vm.post.liked);
				vm.post.liked = !vm.post.liked;
			},

			//赞
			like () {
				let vm = this;

				Util.request(Util.replaceTpl(API.posts_likes, {
					postId: vm.post.id	
				}), null, "post").always(() => {
					vm.$dispatch("post-tool-set-like-end", true);
				});

				vm.post.likes_count += 1;
				vm.$dispatch("show-like-animation");
			},

			//取消赞
			unlike () {
				let vm = this;

				Util.request(Util.replaceTpl(API.posts_likes, {
					postId: vm.post.id	
				}), null, "delete").always(() => {
					vm.$dispatch("post-tool-set-like-end", false);
				});
				
				vm.post.likes_count -= 1;
				vm.$dispatch("show-unlike-animation");//显示取消赞效果
			}
		}
	};
</script>