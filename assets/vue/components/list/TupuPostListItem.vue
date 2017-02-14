<template>
	<li class="tupu-list-item tp-left" v-set-img-size @click.stop="viewImage">
		<i class="icon-sprite icon-top-blue-50 top-icon" v-if="post.sticky"></i>

		<div class="tupu-list-item-content">
			<img src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==" :data-src="post.photo.url | url">
		</div>
		
		<div class="tupu-list-item-tool clearfix" v-show="isShowTool">
			<tupu-tool-comment 
				class-name="tp-left icon-comment-opacity"
				:post="post">
			</tupu-tool-comment>

			<tupu-tool-like 
				class-name="tp-right"
				:post="post"
				v-if="!post.sticky">
			</tupu-tool-like>

			<tupu-tool-top
				class-name="tp-right"
				v-if="post.sticky">
			</tupu-tool-top>
		</div>
	</li>	
</template>
 
<script>
	import $ from "jquery";

	import * as Config from "../../common/Config";
	
	import TupuToolTop from "../TupuToolTop.vue";
	import TupuToolLike from "../like/TupuToolLike.vue";	
	import TupuToolComment from "../comment/TupuToolComment.vue";

	//配置信息
	const GUTTER = 20;//图片右间距
	const VIEW_WIDTH = 600;//行最大宽度
	const MAX_HEIGHT = 300;//图片最大高度
	const MAX_WIDTH = 400;//图片最大宽度
	const SET_TOOL_SHOW_WIDTH = 80;//工具栏显示最小宽度
	const SET_TOOL_SHOW_HEIGHT = 80;//工具栏显示最小高度		

	//工具方法
	let util = {
		//图片网格布局
		handleImages ($element) {
			let sum = 0;
			let currentHeight = 0;

			$element.each(function(){
				sum += $(this).data("currentWidth");
			});
			currentHeight = MAX_HEIGHT * (VIEW_WIDTH - ($element.length - 1) * GUTTER) / sum;
			$element.each(function(){
				let $this = $(this);
				let currentWidth = Math.floor($this.data("currentWidth") / MAX_HEIGHT * currentHeight);
				util.setToolVisibility($this, currentWidth, currentHeight);
				$this.removeData("vm").data({
					currentWidth: currentWidth
				}).attr({
					"data-resized": 1
				}).find("img").css({
					width: currentWidth,
					height: currentHeight
				});
			});			
		},

		//处理最后一张图
		handleLastImage ($element, $last) {
			let sum = util.getSumWidth($element);
			let remain = VIEW_WIDTH - (sum + $element.length * GUTTER);

			if(remain > 0){
				$("<li class=\"tupu-list-item tupu-list-empty-item tp-left\"></li>").css({
					width: remain, 
					height: MAX_HEIGHT
				}).data({
					currentWidth: remain
				}).insertAfter($last);
				$element.each(function(){
					let $this = $(this);
					util.setToolVisibility($this, $this.data("currentWidth"), MAX_HEIGHT);
				});
			}
		},

		//置顶图片需特殊处理
		handleStickyImage ($element, height, width) {
			let currentHeight = VIEW_WIDTH * height / width;
			$element.attr({
				"data-resized": 1//标记为已处理
			}).data({
				currentWidth: VIEW_WIDTH
			}).find("img").css({
				width: VIEW_WIDTH,
				height: currentHeight
			});
			$element.data("vm").isShowTool = true;
			$element.removeData("vm")
		},		

		//获取行所有图片宽度之和
		getSumWidth ($element) {
			let sum = 0;

			$element.each(function(){
				sum += $(this).data("currentWidth");
			});

			return sum;
		},

		//设置工具栏是否显示
		setToolVisibility ($element, width = $element.width(), height = $element.height()) {
			$element.data("vm").isShowTool = width > SET_TOOL_SHOW_WIDTH && height > SET_TOOL_SHOW_HEIGHT;
		},

		//通过Image对象预加载
		loadImage ($img){
			let image = new Image();
			let url = $img.data("src");
			let handleImg = function(){
				$img[0].src = url;
				this.onload = image = $img = null;
			};

			image.onload = function(){
				handleImg.call(this);
			};
			image.src = url;
			if(image.complete){
				handleImg.call(image);
			}
		}
	};		

	export default {
		name: "TupuListItem",

		props: {
			post: {
				type: Object
			},

			hasNext: {
				type: Boolean,
				default: false
			}
		},

		components: {
			TupuToolTop,
			TupuToolLike,
			TupuToolComment
		},

		data () {
			return {
				isShowTool: false
			};
		},

		filters: {
			url (url){
				return url ? url + "?imageView/2/w/640/" : "";
			}
		},

		directives: {
			//设置图片网格布局
			"set-img-size" () {
				this.vm.$nextTick(function(){
					let sum;
					let $prevs;	
					let $element;
					let vm = this;										
					let currentWidth;
					let photo = vm.post.photo;
					let width = photo.width;
					let height = photo.height;								

					$element = $(vm.$el).data({vm: vm});
					if(($prevs = $element.prev()).hasClass("tupu-list-empty-item")){
						currentWidth = $prevs.data("currentWidth");
						$prevs.replaceWith($element.css({
							height: MAX_HEIGHT,
							width: currentWidth
						}).data({
							currentWidth: currentWidth
						}));
						util.handleImages($element.prevAll(":not([data-resized])").addBack($element));
					}else if(vm.post.sticky){
						util.handleStickyImage($element, height, width);//置顶照片，特殊处理
					}else{
						currentWidth = Math.ceil(MAX_HEIGHT * width / height);
						$element.data({currentWidth: currentWidth});
						$prevs = $element.prevAll(":not([data-resized])");
						sum = util.getSumWidth($prevs);
						if((sum + currentWidth) >= MAX_WIDTH){
							util.handleImages($prevs.add($element));
						}else if(!$element.next().length){
							if(this.hasNext){
								//若有数据需特殊处理
								util.handleLastImage($element.prevAll(":not([data-resized])").addBack($element), $element);
							}else{
								//若没数据则直接网格布局
								util.handleImages($prevs.add($element));
							}
						}
					}

					sum = 0;
					util.loadImage($element.find("img"));
				});
			}
		},

		methods: {
			//查看单图
			viewImage () {
				let vm = this;
				Config.config.router.go({
					name: "postView",
					params: {
						postId: vm.post.id,
						page: vm.post._pageCount
					}
				});
			}
		}
	};
</script>

<style lang="less">
	@import "../../../less/base.less";

	.tupu-list-item{
		position: relative;
		margin-right: 20px;
		margin-bottom: 20px;
		visibility: visible;

		.top-icon{
			top: 0;
			right: 0;
			z-index: 1000;
			position: absolute;
		}

		.tupu-list-item-content{
			img{
				height: 300px;
			}
		}
	
		.tupu-list-item-tool{
			left: 20px;
			right: 20px;
			bottom: 20px;
			height: 50px;
			line-height: 50px;
			position: absolute;
		}
	}	

	.tupu-list-empty-item{
		background: #CCC;
	}	
</style>