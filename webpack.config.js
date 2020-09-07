const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    entry: {
        login: './src/login.ts',
        user: './src/user.ts'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/],
            }
        }, {
            test: /\.less$/,
            loader: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
        }, {
            test: /\.css$/,
            loader: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader']
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.pug$/,
            loader: 'pug-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new HtmlWebpackPlugin({
            template: './src/templates/login.pug',
            chunks: ['login'],
            filename: '/login.html',
            locals: {
                title: 'Login page - Charity Chain'
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/templates/user.pug',
            chunks: ['user'],
            filename: '/user.html',
            locals: {
                title: 'Charity Chain'
            }
        }),
    ],
    mode: 'development'
}