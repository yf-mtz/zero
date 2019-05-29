const glob = require('glob')
const modulesSrcList = glob.sync('./src/modules/*/main.js')// 获取所有子项目入口路径
const serveParameter = JSON.parse(process.env.npm_config_argv).cooked[2]// 获取serve运行时候的--参数
const serveModuleName = serveParameter ? serveParameter.replace(/^-+/g, '') : 'index'// 判断是否有参数 有截取开头所有 - 符号 没有参数的情况下默认为index
const moduleNameList = (() => {// 获取所有项目名称列表
	let list = []
	modulesSrcList.map((src) => list.push(src.split('/')[3]))
	return list
})()

if (moduleNameList.indexOf(serveModuleName) === -1) {// 判断参数是否存在于项目名称列表
	console.log('\033[41;32m Error: \033[47;30m', `${serveModuleName}项目不存在`, '\033[0m')
	return
}

const pagesConfig = (() => {// 获取项目多页面配置
	let pages = {}
	if (process.env.NODE_ENV === 'production') { // 打包单独生成每个文件夹的html入口
		pages[serveModuleName] = {
			entry: `src/modules/${serveModuleName}/main.js`,
			template: `src/modules/${serveModuleName}/public/${serveModuleName}.html`,
			filename: `${serveModuleName}.html`,
			chunks: ['chunk-vendors', 'chunk-common', serveModuleName]
		}
	}
	else {
		moduleNameList.map(
				(fileName) => {
					pages[fileName] = {
						entry: `src/modules/${fileName}/main.js`,
						template: `src/modules/${fileName}/public/${fileName}.html`,
						filename: `${fileName}.html`,
						chunks: ['chunk-vendors', 'chunk-common', fileName]
					}
				}
		)
	}
	return pages
})()
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '' : `/`,
	devServer: {
		port: 8080,
		host: 'localhost',
		https: false,
		hot: true,
		open: true,
		index: `${serveModuleName}.html`,
	},
	configureWebpack: {
		resolve: {
			alias: {
				'#': './public',
				'@@':'../assets',
			},
		}
	},
	productionSourceMap: false, // 生产环境map映射 默认true压缩打包后的文件为一行格式
	outputDir: `dist/${serveModuleName}`,
	pages: pagesConfig,
}
