const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

// 如果需要执行start本地运行的话需要将entry以及output切换到example下
module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
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
    plugins: [
        new CleanWebpackPlugin()
    ],
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            root: 'ReactDOM',
        },
    }
}