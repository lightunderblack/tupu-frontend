<template>
	<div class="tp-edit-photo-caption-wrapper tp-container-wrapper">
		<tupu-top-banner 
			:has-go-back="true">
			<template slot="content">写照片说明</template>
		</tupu-top-banner>
		
		<div class="tp-container-info">
			<div class="tp-edit-photo-caption">
				<textarea  
					v-model="caption"
					class="word-break"
					placeholder="填写照片说明"></textarea>
				<div class="text-center">
					<a href="#" class="btn-commit text-center" @click.stop.prevent="save">完成</a>
				</div>
			</div>			
		</div>
	</div>
</template>

<script>
	import $ from "jquery";

	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";
	import * as CharOperation from "../../common/CharOperation";

	import TupuTopBanner from "../banner/TupuTopBanner.vue";

	const API = {
		"posts_post" : "posts/{{postId}}/"
	};
	const MAX_CHARACTER = 300;//限制图说最大输入字符数
	const LOAD_PROMISE_NAME = "load-post";
	const EDIT_PROMISE_NAME = "edit-photo-caption";

	export default {
		name: "TupuEditPhotoCaption",

		data () {
			return {
				caption: "",
				pending: false
			};
		},

		components: {
			TupuTopBanner
		},

		route: {
			data ({to, from}) {
				let vm = this;
				
				$(window).scrollTop(0);
				vm.$dispatch("set-wx-share");
				vm.postId = to.params.postId;
				vm.loadData();
			},

			deactivate () {
				let vm = this;

				vm.postId = "";
				vm.caption = "";
				vm.pending = false;
				Util.abortPromise(LOAD_PROMISE_NAME);
				Util.abortPromise(EDIT_PROMISE_NAME);
			}
		},

		methods: {
			goBack () {
				window.history.go(-1);
			},

			save () {
				let post;
				let vm = this;
				let posts = Config.posts.data;
				let caption = $.trim(vm.caption);

				vm.$dispatch("show-loading", true);
				Util.abortPromise(EDIT_PROMISE_NAME);

				Util.promiseCollection[EDIT_PROMISE_NAME] = Util.request(Util.replaceTpl(API.posts_post, {
					postId: vm.postId
				}), {
					caption
				}, "put").done(({post}) => {
					if(post && post.id){
						if((posts || []).length && (post = posts[Util.getIndexById(posts, post.id)])){
							post.photo.caption = caption;
						}
						vm.goBack();
					}
				}).always(() => {
					vm.$dispatch("show-loading", false);
					Util.promiseCollection[EDIT_PROMISE_NAME] = null;
				});
			},

			loadData () {
				let vm = this;
				let posts = Config.posts.data || [];
				let post = posts[Util.getIndexById(posts, vm.postId)];

				if(post && post.id){
					vm.$dispatch("show-loading", false);
					vm.caption = post.photo.caption || "";
				}else{
					vm.$dispatch("show-loading", true);
					Util.abortPromise(LOAD_PROMISE_NAME);
					Util.promiseCollection[LOAD_PROMISE_NAME] = Util.request(Util.replaceTpl(API.posts_post, {
						postId: vm.postId
					})).done(({post:{photo}}) => {
						vm.caption = photo.caption;
					}).always(() => {
						vm.$dispatch("show-loading", false);
						Util.promiseCollection[LOAD_PROMISE_NAME] = vm = null;
					});					
				}
			},

			restrictContent () {
				let vm = this;
				let caption = $.trim(vm.caption);

				if(CharOperation.strLen(caption) > MAX_CHARACTER){
					vm.caption = CharOperation.subCHStr(caption, 0, MAX_CHARACTER);
				}
			}		
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	.tp-edit-photo-caption{
		textarea{
			border: none;
			resize: none;
			height: 250px;
			color: #5A5555;
			font-size: 32px;
			background: #FFF;
			line-height: 46px;
			padding: 27px 43px;
			margin-bottom: 25px;
			box-sizing: border-box;
			width: @viewpoint-width;
		}

		.btn-commit{
			color: #FFF;
			height: 80px;
			width: 573px;
			font-size: 28px;
			line-height: 80px;
			border-radius: 4px;
			background: #2F5BA3;
			display: inline-block;
			box-sizing: border-box;
		}
	}	
</style>