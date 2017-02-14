<template>
	<div class="tp-post-comment-wrapper">
		<tupu-top-banner 
			:has-go-back="true">
			<template slot="content">
				<p class="text-center">评论<span class="comments-count">（{{commentsCount}}）</span></p>	
			</template>
		</tupu-top-banner>

	    <div class="comment-list-wrapper">
			<ul class="comment-list">
				<tupu-comment-item
					v-for="comment in comments"  
					track-by="id" 
					stagger="50"
					transition="stagger"
					:comment="comment"
					@remove-comment="removeComment">	
				</tupu-comment-item>
			</ul>
			
			<tupu-download-app-link v-show="isShowDownloadTip"></tupu-download-app-link>
	    </div>

	    <div class="comment-input-wrapper clearfix">
	        <input 
	        	type="text" 
	        	spellcheck="false" 
	        	placeholder="写评论" 
	        	class="tp-left" 
	        	v-model="content"
	        	@input="restrictComment"
	        	@keyup.enter="addComment">
	        <a href="#" class="tp-left send-comment-btn border-radius-8 text-center" @click.stop.prevent="sendComment">发送</a>
	    </div>

		<tupu-confirm
			@tupu-confirm-ok="toRemoveComment"
			@tupu-confirm-cancel="cancelRemoveComment"
			:is-show.sync="isShowDelComDlg"
			ok-btn-class="btn-warning" 
			ok-btn-text="删除评论">
			<p>删除这条评论？</p>
		</tupu-confirm>
	</div>
</template>

<script>
	import * as Util from "../../common/Util";
	import * as Config from "../../common/Config";
	import * as CharOperation from "../../common/CharOperation";

	import TupuCommentItem from "./TupuCommentItem.vue";
	import TupuConfirm from "../dialog/TupuConfirm.vue";
	import TupuTopBanner from "../banner/TupuTopBanner.vue";
	import TupuDownloadAppLink from "../downloadApp/TupuDownloadAppLink.vue";


	const PER_PAGE_SIZE = 5;//加载数据每页条数
	const MAX_CHARACTER = 300;//限制评论最大输入字符数
	const API = {
		posts_comments: "posts/{{post_id}}/comments/",//获取评论
		posts_comment_remove: "posts/{{post_id}}/comments/{{comment_id}}/"
	};

	export default {
		name: "TupuComment",

		components: {
			TupuConfirm,
			TupuTopBanner,
			TupuCommentItem,
			TupuDownloadAppLink
		},

		data () {
			return {
				content: "",
				comments: [],//评论数据列表
				pagination: {},
				commentsCount: 0,//评论数
				
				isShowDelComDlg: false,
				postCommendPending: false,
				deleteCommentPending: false
			};
		},

		computed: {
			isShowDownloadTip () {
				return (this.pagination.total || 0) > PER_PAGE_SIZE;
			}
		},

		route: {
			data ({to}) {
				let vm = this;

				//重置
				vm.comments = [];
				vm.content = "";
				vm.comment = null;
				vm.pagination = {};
				vm.commentsCount = 0;
				vm.postId = to.params.postId;
				vm.postCommendPending = false;
				vm.deleteCommentPending = false;
				
				$(window).scrollTop(0);
				vm.$dispatch("set-wx-share");
				vm.loadComment(true);//载入数据
			}
		},

		methods: {
			//限定评论字符数
			restrictComment () {
				let vm = this;
				let content = $.trim(vm.content);

				if(CharOperation.strLen(content) > MAX_CHARACTER){
					vm.content = CharOperation.subCHStr(content, 0, MAX_CHARACTER);
				}
			},

			//回车触发添加评论
			addComment () {
				let vm = this;

				vm.toAddComment();
			},

			//点击发送按钮添加评论
			sendComment () {
				this.toAddComment();
			},

			//删除评论
			removeComment (comment) {
				let vm = this;

				vm.comment = comment;
				vm.isShowDelComDlg = true;
			},

			//添加评论后台请求
			toAddComment () {
				let vm = this;
				let promiseName = "post-comment-" + vm.postId;
				let content = CharOperation.subCHStr($.trim(vm.content), 0, MAX_CHARACTER);

				if(!content || vm.postCommendPending){
					return;
				}

				vm.postCommendPending = true;
				Util.abortPromise(promiseName);
				Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.posts_comments, {
					post_id: vm.postId
				}), {
					comment: content
				}, "post").done((data) => {
					vm.content = "";
					vm.loadComment();//重新载入评论列表
				}).always(() => {
					vm.postCommendPending = false;
					Util.promiseCollection[promiseName] = null;	
				});
			},			

			//删除评论后台请求
			toRemoveComment () {
				let vm = this;
				let isAborted = false;
				let commentId = vm.comment.id;
				let promiseName = "post-comment-remove-" + commentId;

				if(vm.isRemovePending){
					return;
				}

				vm.isRemovePending = true;
				vm.removePromiseName = promiseName;
				Util.abortPromise(promiseName);
				Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.posts_comment_remove, {
					post_id: vm.postId,
					comment_id: commentId
				}), null, "delete").done(function(data, content, jqXHR){
					if(jqXHR.status === 204){
						vm.loadComment(false);
						vm.commentsCount -= 1;
						vm.comments.$remove(vm.comment);
					}
				}).fail(function(jqXHR, textStatus){
					if(textStatus === "abort"){
						isAborted = true;
					}
				}).always(function(){
					if(!isAborted){
						Util.promiseCollection[promiseName] = null;
						vm.isRemovePending = vm.isShowDelComDlg = false;
					}
				});
			},

			cancelRemoveComment () {
				let vm = this;

				Util.abortPromise(vm.removePromiseName);
				vm.isRemovePending = vm.isShowDelComDlg = false;
			},

			//载入评论数据
			loadComment (isShowLoading = false) {
				let vm = this;
				let promiseName = "get-comment-" + vm.postId;

				$(window).scrollTop(0);//将滚动条置为顶部
				isShowLoading && vm.$dispatch("show-loading", true);
				Util.abortPromise(promiseName);
				Util.promiseCollection[promiseName] = Util.request(Util.replaceTpl(API.posts_comments, {
					post_id: vm.postId
				}), {
					per_page: PER_PAGE_SIZE
				}).done((data) => {
					vm.comments = data.comments;
					vm.pagination = data.pagination;
					vm.commentsCount = vm.pagination.total || 0;
					$.each(data.comments, (i, comment) => {
						Util.cacheUser(comment.user);
					});
				}).fail((jqXHR, textStatus) => {
				}).always(() => {
					isShowLoading && vm.$dispatch("show-loading", false);
					Util.promiseCollection[promiseName] = null;
				});
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

	.tp-post-comment-wrapper{
	    margin: 0 auto;
	    min-height: 100%;
	    position: relative;    
	    background: #E4E4E4;
	    width: @viewpoint-width;


	    .tupu-top-banner{
			.comments-count{
				padding-left: 20px;
			}            
		}

	    .comment-input-wrapper{
	        bottom: 0;
	        position: fixed;
	        padding: 16px 0;
	        background: #F1F1F1;
	        width: @viewpoint-width;

	        input{
	            color: #5A5555;
	            height: 60px;
	            width: 500px;
	            padding: 0 20px;
	            font-size: 28px;
	            margin-left: 15px;
	            line-height: 60px;
	            box-sizing: border-box;
	        }

	        .send-comment-btn{
	            color: #FFF;
	            height: 60px;
	            width: 100px;
	            font-size: 28px;
	            line-height: 60px;
	            margin-left: 15px;
	            background: #2F5BA3;
	        }
	    }

	    .comment-list-wrapper{
	        top: 105px;
	        position: relative;
	        padding-bottom: 200px;
	    }

	    .comment-list{
	        background: #FFF;
	    }

	    .download-tupu-app{
	        height: 50px;
	        display: block;
	        color: #2F5BA3;
	        padding: 20px 0;
	        background: #FFF;
	        line-height: 50px;
	        font-size: @baseFontSize;
	    }

	    .icon-download-blue{
	    	top: 6px;
	    	position: relative;
	    	margin-right: 10px;	
	    }
	}	
</style>