var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        "personal-group": "./assets/vue/personal-group.js"
    },

    output: {
        filename: '[name]' + '.js', 
        publicPath: '/assets/js/vue/',     
        path: path.resolve(__dirname, './assets/js/vue')
    },

    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },

    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                  limit: 10000,
                  name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    vue: {
        loaders: {
          less: 'style!css!less?{"modifyVars":{"imgPath": "https://dn-tupu-dev.qbox.me/img"}}'
        }
    },

    devServer: {
        noInfo: true,
        historyApiFallback: true
    },

    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.vue.loaders.less = 'style!css!less?{"modifyVars":{"imgPath": "https://dn-tupu-asset.qbox.me/img"}}';
    
    //http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: '"production"'}
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false}
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);
}
