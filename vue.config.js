const projectName = process.argv[3]
const glob = require('glob')
let getEntry = () => {
	let pages = {}
	if (process.env.NODE_ENV === 'production') {
		pages[projectName] = {
			entry: `src/modules/${projectName}/main.js`,
			template: `src/modules/${projectName}/${projectName}.html`,
			filename: `${projectName}.html`,
			chunks: ['chunk-vendors', 'chunk-common', projectName]
		}
	}
	else {
		let modules = glob.sync('./src/modules/*/*.js')
		for (let i in modules) {
			let filePath = modules[i]
			let fileList = filePath.split('/')
			let fileName = fileList[fileList.length - 2]
			pages[fileName] = {
				entry: `src/modules/${fileName}/main.js`,
				template: `src/modules/${fileName}/${fileName}.html`,
				filename: `${fileName}.html`,
				chunks: ['chunk-vendors', 'chunk-common', fileName]
			}
		}
	}
	return pages
}
const pagesConfig = getEntry()

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
	devServer: {
		port: 8080,
		host: 'localhost',
		https: false,
		hot: true,
		open: true,
	},
	outputDir: `dist/${projectName}`,
	pages: pagesConfig
}
