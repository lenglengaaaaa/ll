const path = require("path");
const webpack = require("webpack");

module.exports = {
    // 你想要打包的模块的数组
    entry: {
        vendor: [
            'vue',
            // 'element-ui',
            'vuex',
            'vue-router',
            'moment',
            'axios',
            'js-cookie',
            'mqtt',
            'nprogress',
            'jquery',
            'lodash',
            'echarts',
            'vuex-persistedstate',
            'vue-infinite-scroll'
        ] 
    },
    output: {
        path: path.resolve(__dirname, '../static/js'), // 打包后文件输出的位置
        filename: '[name].dll.js',
        library: '[name]_library' 
        // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '[name]-manifest.json'),
            name: '[name]_library', 
            context: __dirname
        })
    ]
};