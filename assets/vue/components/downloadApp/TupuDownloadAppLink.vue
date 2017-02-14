<template>
	<a href="http://a.app.qq.com/o/simple.jsp?pkgname=im.tupu.tupu&g_f=991653" class="tp-download-app-link text-center" :class="className">
		<i class="icon-sprite" :class="iconClassName"></i>{{{content}}}
	</a>
</template>

<script>
	export default {
		name: "TupuDownloadAppLink",

		props: {
			content: {
				type: String,
				default: "安装<strong>图扑APP</strong>&nbsp;获得极速相册体验"
			},

			className: {
				default: "",
				type: String
			},

			iconClassName: {
				type: String,
				default: "icon-download-blue"
			}
		}
	};
</script>

<style lang="less">
	@height: 55px;

    .tp-download-app-link{
    	color: #2F5BA3;
        display: block;
        font-size: 26px;
        height: @height;
        padding: 20px 0;
        background: #FFF;
        line-height: @height;

        i{
            top: 8px;
            margin-right: 5px;
            position: relative;
        }
    }
</style>