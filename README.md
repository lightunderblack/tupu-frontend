# tupu-frontend-next

`Vue`重构tupu前端。工具链：`ES6`/`Less`/`Sass`/`Compass`/`Webpack`/`Grunt`

#步骤

1. 使用到`Sass` + `Compass`，需`Ruby`运行环境，请先安装`Ruby`，版本不能低于2。[Ruby官网](https://www.ruby-lang.org/en/downloads/)；[Windows下Ruby安装包](http://rubyinstaller.org/)。

2. 运行`gem install compass`

3. 确保安装`Node.js`，若未安装，请前往[Node.js官网](https://nodejs.org/en/)下载安装包。

4. 确保安装`grunt-cli`，若未安装，请运行`npm install grunt-cli -g`。

5. 切换到项目根目录，运行`npm install`下载依赖模块。

6. 本地开发环境：运行`grunt local`；生成测试开发环境文件 ：运行`grunt dev`；生成生产环境文件：运行`grunt product`。

#友情提醒

1. 微信jsdk`jweixin.js`使用`Webpack`中引入时会报错。本次解决办法是修改源码中`this`为`window`，问题详细描述以及解决：[使用vue cli 构建的项目，现在需要使用微信js sdk，如何使用](https://segmentfault.com/q/1010000005097021)，[when using both 'babel-loader' and 'imports-loader', `this=>window` will not work](https://github.com/webpack/imports-loader/issues/23)。

