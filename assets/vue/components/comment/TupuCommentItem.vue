<template>
	<li class="comment-item clearfix">
		<tupu-user-avatar 
			class-name="tp-left" 
			:user-id="comment.user.id"
			:user-avatar="comment.user.headimgurl">
		</tupu-user-avatar>

		<div class="comment-content-wrapper">
			<div class="comment-content">
				<template v-if="comment.to_user.id">
					<a href="javascript:void(0)" class="person">{{comment.user.nickname}}</a><span class="gray">回复</span><a href="javascript:void(0)" class="person">{{comment.user.nickname}}：</a>					
				</template>
				<a href="javascript:void(0)" class="person" v-else>{{comment.user.nickname}}：</a>
				{{comment.comment}}
			</div>
			
	        <div class="comment-foot clearfix">
	            <span class="tp-left comment-time">{{comment.created | timeHandler}}</span>
                <div class="comment-operate tp-right" v-if="isCanDelete">
                    <i class="icon-sprite icon-trash-gray" @click.stop="removeComment"></i>
                </div>
	        </div>
	    </div>
	</li>
</template>

<script>
	import * as Config from "../../common/Config";

	import TupuUserAvatar from "../user/TupuUserAvatar.vue";
	
	export default {
		name: "TupuCommentItem",

		components: {
			TupuUserAvatar
		},

		props: {
			comment: {
				user: {},
				to_user: {}	
			}
		},

		computed: {
			isCanDelete () {
				return this.comment.user.id === Config.userInfo.id;
			}
		},

		methods: {
			//删除评论
			removeComment () {
				let vm = this;
				vm.$dispatch("remove-comment", vm.comment);
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base";

    .comment-item{
        padding: 20px 24px 16px 20px;
        border-bottom: 1px solid #DEDEDE;

	    .tp-user-avatar{
	        width: 56px;
	        height: 56px;
	        border-radius: 4px;
	        border: 1px solid transparent;
	    } 
	    
	    .comment-content-wrapper{
	        padding-left: 76px;
	    }     

	    .comment-content{
	        color: #5A5555;
	        line-height: 39px;
	        word-wrap: break-word;
	        word-break: break-all;
	        font-size: @baseFontSize;
	    }  
	    
	    .person{
	        color: #2F5BA3;
	    }  
	    
	    .gray{
	        color: #AAA;
	    }  
	    
	    .comment-foot{
	        margin-top: 8px;
	    } 
	    
	    .comment-time{
	        color: #AAA;
	        font-size: 20px;
	        line-height: 30px;
	    }         
    }  

</style>