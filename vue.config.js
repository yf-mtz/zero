const projectName = process.argv[3]
const glob = require('glob')
// 获取serve运行时候的项目名字
const serveParameter = JSON.parse(process.env.npm_config_argv).cooked[2]
// 判断是否有参数 有截取开头所有 - 符号 没有参数的情况下默认为index
const serveModuleName = serveParameter ? serveParameter.replace(/^-+/g, '') : 'index'
// 获取项目多页面配置
let getPagesConfig = () => {
	let pages = {}
	if (process.env.NODE_ENV === 'production') {
		pages[projectName] = {
			entry: `src/modules/${projectName}/main.js`,
			template: `src/modules/${projectName}/public/${projectName}.html`,
			filename: `${projectName}.html`,
			chunks: ['chunk-vendors', 'chunk-common', projectName]
		}
	}
	else {
		// 检测子项目入口文件获取所有子项目名称
		let modules = glob.sync('./src/modules/*/main.js')
		for (let i in modules) {
			let fileList = modules[i].split('/')
			let fileName = fileList[fileList.length - 2]
			pages[fileName] = {
				entry: `src/modules/${fileName}/main.js`,
				template: `src/modules/${fileName}/public/${fileName}.html`,
				filename: `${fileName}.html`,
				chunks: ['chunk-vendors', 'chunk-common', fileName]
			}
		}
	}
	return pages

}
const pagesConfig = getPagesConfig()

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
	devServer: {
		port: 8080,
		host: 'localhost',
		https: false,
		hot: true,
		open: true,
		index: `${serveModuleName}.html`
	},
	// 生产环境map映射 默认true压缩打包后的文件为一行格式
	productionSourceMap: false,
	outputDir: `dist/${projectName}`,
	pages: pagesConfig
}
