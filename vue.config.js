const tools = require('./tools/tools.js')
let moduleNameList = tools._moduleNameList
let moduleName = tools._moduleName
let config = moduleName => { // page的基本配置
		return {
				entry: `src/modules/${moduleName}/main.js`,
				template: `src/modules/${moduleName}/${moduleName}.html`,
				filename: `${moduleName}.html`,
				chunks: ['chunk-vendors', 'chunk-common', moduleName]
		}
}
let pageConfig = (() => {// 获取项目多页面配置
		let page = {}
		process.env.NODE_ENV === 'production' || `${moduleName}` !== 'index'
				? page[moduleName] = config(moduleName) // 非index项目运行配置单页面模式
				: moduleNameList.map(moduleName => page[moduleName] = config(moduleName))// index项目运行或打包时配置为多页面
		return page
})()
if (process.env.NODE_ENV === 'development') tools._infoLog(`${moduleName} server start`, 'start') // 开发环境下打印项目运行提示
module.exports = {
		publicPath: process.env.NODE_ENV === 'production' ? `` : `/${moduleName}/${moduleName}.html`,// 修正项目运行的url为子项目路径
		devServer: {
				port: 8080,
				host: 'localhost',
				https: false,
				hot: true,
				open: true,
				index: `${moduleName}.html`
		},
		productionSourceMap: false, // 禁止产生map文件,调试开启
		outputDir: `dist/${moduleName}`,
		pages: pageConfig,
		chainWebpack: config => config.plugin('copy')// 覆盖copy插件的默认配置 子项目的public单独进行打包
				.use(require('copy-webpack-plugin'), [[{
						from: `${__dirname}/src/modules/${moduleName}/public`,
						to: `./`,
						ignore: /\.html$/,
						force: true
				}]])
}
