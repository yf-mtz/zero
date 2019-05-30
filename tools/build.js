const glob = require('glob')
const child_process = require('child_process')
const exec = child_process.exec
const log = require('./log.js')
const npmParameter = JSON.parse(process.env.npm_config_argv).cooked[2] //获取build运行命令的参数
const moduleName = npmParameter ? npmParameter.replace(/^-+/g, '') : log.error('build命令必须有参数') //判断参数是否存在
let moduleNameList = (() => {// 获取子项目名称
	let htmlPathList = glob.sync('./src/modules/*/*.html')
	let moduleNameArray = []
	for (let i in htmlPathList) {
		let filePath = htmlPathList[i]
		let fileList = filePath.split('/')
		let fileName = fileList[fileList.length - 2]
		moduleNameArray.push(fileName)
	}
	return moduleNameArray
})()

/**
 * 打包函数
 * @param moduleName 子项目名称
 */
let build = (moduleName) => {
	if (moduleName !== '@all' && moduleName) {// 单个modules打包
		if (moduleNameList.indexOf(moduleName) === -1) {// 判断参数名称是否存在于子项目中
			log.error(`${moduleName} 项目不存在`)
		}
		else {
			info.log(moduleName, 'build start')
			exec(`vue-cli-service build ${moduleName}`, (err) => {if (err) console.log(err)})
					.stdout.on('data', data => console.log(data))
					.on('end', () => {
						log.state(moduleName, 'build succeed')
					})
		}
	}
	else if (moduleName === '@all') {// 全部modules打包
		moduleNameList.forEach((item) => {
			exec(`npm run build ${item}`, (err) => {if (err) console.log(err)})
					.stdout.on('data', data => console.log(data))
		})
	}
}
build(moduleName)
