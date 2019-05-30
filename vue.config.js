const glob = require('glob')
const modulesSrcList = glob.sync('./src/modules/*/main.js')// 获取所有子项目入口路径
const info = require('./tools/consoleInfo.js')
const serveParameter = JSON.parse(process.env.npm_config_argv).cooked[2]// 获取serve运行时候的--参数
const moduleNameList = modulesSrcList.map((src) => {return (src.split('/'))[3]})// 获取所有项目名称列表
let errorLog = errorText => console.log('\033[41;32m ERROR: \033[47;30m', errorText, '\033[0m') // 异常信息打印
let _error = text => {throw new Error(errorLog(text))} // 抛出异常
const serveModuleName = serveParameter ? serveParameter.replace(/^-+/g, '') : info.error('请输入要运行的项目名称参数')
if (process.env.NODE_ENV !== 'production'){// 开发环境判断参数是否存在于项目名称列表
	moduleNameList.indexOf(serveModuleName) === -1 ? _error(`${serveParameter}项目不存在`)
			: info.log(serveModuleName, 'service start')
}
const pagesConfig = (() => {// 获取项目多页面配置
	let pages = {}
	if (process.env.NODE_ENV === 'production') { // 打包单独生成每个文件夹的html入口
		pages[serveModuleName] = {
			entry: `src/modules/${serveModuleName}/main.js`,
			template: `src/modules/${serveModuleName}/${serveModuleName}.html`,
			filename: `${serveModuleName}.html`,
			chunks: ['chunk-vendors', 'chunk-common', serveModuleName]
		}
	}
	else {
		moduleNameList.map((fileName) => {
			pages[fileName] = {
				entry: `src/modules/${fileName}/main.js`,
				template: `src/modules/${fileName}/${fileName}.html`,
				filename: `${fileName}.html`,
				chunks: ['chunk-vendors', 'chunk-common', fileName]
			}
		})
	}
	return pages
})()
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? `` : `/${serveModuleName}/${serveModuleName}.html`,
	devServer: {
		port: 8080,
		host: 'localhost',
		https: false,
		hot: true,
		open: true,
		index: `${serveModuleName}.html`,
		useLocalIp: true,
	},
	productionSourceMap: false, // 生产环境map映射 默认true压缩打包后的文件为一行格式
	outputDir: `dist/${serveModuleName}`,
	pages: pagesConfig,
	chainWebpack: config => { // 覆盖copy插件的默认配置 子项目的public单独进行打包
		config.plugin('copy')
				.use(require('copy-webpack-plugin'), [[{
					from: `${__dirname}/src/modules/${serveModuleName}/public`,
					to: `./`,
					ignore: /\.html$/,
					force: true
				}]])
	}
}
