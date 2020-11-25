// 如果需要打包，需要将package.json的入口文件改为lib/index.js，并将当前文件中的注释项去掉注释，并注释同名配置
const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 如果需要执行start本地运行的话需要将entry以及output切换到example下
module.exports = {
    entry: path.join(__dirname, './example/src/index.tsx'),
    output: {
        path: path.join(__dirname, 'example/dist'),
        filename: 'bundle.js',
    },
    // entry: {
    //     index: './src/index.js',
    // },
    // output: {
    //     path: path.resolve(__dirname, "lib"),
    //     filename: '[name].js',
    //     libraryTarget: 'commonjs2'
    // },
    module: {
        rules: [{
                test: /\.tsx?/,
                loader: 'ts-loader',
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true
                    }
                }],
            }
        ],
    },
    //处理路径解析
    resolve: {
        //extensions 拓展名
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './example/src/index.html'),
            filename: './index.html',
        })
    ],
    // externals: {
    //     react: {
    //         commonjs: 'react',
    //         commonjs2: 'react',
    //         amd: 'react',
    //         root: 'React',
    //     },
    //     'react-dom': {
    //         commonjs: 'react-dom',
    //         commonjs2: 'react-dom',
    //         amd: 'react-dom',
    //         root: 'ReactDOM',
    //     },
    // }
}