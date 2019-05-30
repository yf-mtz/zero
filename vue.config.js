const glob = require("glob")
const modulesSrcList = glob.sync("./src/modules/*/main.js")// 获取所有子项目入口路径
const log = require("./tools/log.js")
const serveParameter = JSON.parse(process.env.npm_config_argv).cooked[2]// 获取serve运行时候的--参数
const moduleNameList = modulesSrcList.map((src) => {
	return (src.split("/"))[3]
})// 获取所有项目名称列表
const serveModuleName = serveParameter ? serveParameter.replace(/^-+/g, "") : log.error("请输入要运行的项目名称参数")
if (process.env.NODE_ENV !== "production") {// 开发环境判断参数是否存在于项目名称列表
	moduleNameList.indexOf(`${serveModuleName}`) === -1 ? log.error(`${serveParameter}项目不存在`)
			: log.state(serveModuleName, "service start")
}
const pagesConfig = (() => {// 获取项目多页面配置
	let pages = {}// 打包单独生成每个文件夹的html入口 只有index项目运行全部子项目 其他项目只运行自己的代码
	if (process.env.NODE_ENV === "production" || `${serveModuleName}` !== "index") {
		pages[serveModuleName] = {
			entry: `src/modules/${serveModuleName}/main.js`,
			template: `src/modules/${serveModuleName}/${serveModuleName}.html`,
			filename: `${serveModuleName}.html`,
			chunks: ["chunk-vendors", "chunk-common", serveModuleName]
		}
	}
	else {
		moduleNameList.map((fileName) => {
			pages[fileName] = {
				entry: `src/modules/${fileName}/main.js`,
				template: `src/modules/${fileName}/${fileName}.html`,
				filename: `${fileName}.html`,
				chunks: ["chunk-vendors", "chunk-common", fileName]
			}
		})
	}
	return pages
})()
module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? `` : `/${serveModuleName}/${serveModuleName}.html`,
	devServer: {
		port: 8080,
		host: "localhost",
		https: false,
		hot: true,
		open: true,
		index: `${serveModuleName}.html`
	},
	productionSourceMap: false, // 生产环境map映射 默认true压缩打包后的文件为一行格式
	outputDir: `dist/${serveModuleName}`,
	pages: pagesConfig,
	chainWebpack: config => { // 覆盖copy插件的默认配置 子项目的public单独进行打包
		config.plugin("copy")
				.use(require("copy-webpack-plugin"), [[{
					from: `${__dirname}/src/modules/${serveModuleName}/public`,
					to: `./`,
					ignore: /\.html$/,
					force: true
				}]])
	}
}
