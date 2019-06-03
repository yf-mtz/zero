let {moduleNameList, moduleName, stateLog, isDevelopment} = require('./tools/utils.js')

let pageConfig = (() => {// 获取项目多页面配置
		let page = {}
		let config = moduleName => { // page的基本配置
				return {
						entry: `src/modules/${moduleName}/main.js`,
						template: `src/modules/${moduleName}/${moduleName}.html`,
						filename: `${moduleName}.html`,
						chunks: ['chunk-vendors', 'chunk-common', moduleName]
				}
		}
		isDevelopment && moduleName === 'index' //如果没有index这种导航项目, 只需要输出单页面配置即可
				? moduleNameList.map(itemName => page[itemName] = config(itemName))// index项目运行时配置多页面 全部项目运行
				: page[moduleName] = config(moduleName) // 生产环境和非index项目运行配置单页面 执行多次单独打包
		return page
})()

if (isDevelopment) {stateLog('start', `${moduleName} server start`)}// 开发环境下打印项目运行提示

module.exports = {
		publicPath: isDevelopment ? `/${moduleName}/${moduleName}.html` : ``,// 修正项目运行的url为子项目路径
		devServer: {
				port: 8080,
				host: 'localhost',
				https: false,
				hot: true,
				open: true,
				index: `${moduleName}.html`
		},
		productionSourceMap: true, // 生成map文件方便调试,部署关闭
		outputDir: `dist/${moduleName}`,
		pages: pageConfig,
		chainWebpack: config => config.plugin('copy')// 覆盖copy插件的默认配置 子项目的public单独进行打包
				.use(require('copy-webpack-plugin'), [[{
						from: `./src/modules/${moduleName}/public`,
						to: `./`,
						force: true
				}]])
}

