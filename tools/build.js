const glob = require('glob')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const exec = child_process.exec
let errorLog = (text) => {
	console.log('\033[41;32m Error: \033[47;30m', text, '\033[0m')
	return
}
const npmParameter = JSON.parse(process.env.npm_config_argv).cooked[2] //获取build运行命令的参数
const moduleName = npmParameter ? npmParameter.replace(/^-+/g, '') : errorLog('build命令必须有参数')
/**
 * 打包执行的信息打印
 * @param moduleName  模块名字
 * @param state 状态
 */
let buildLog = (moduleName, state) => {
	if (state === 'start') {
		console.log('\033[44;30m', `${moduleName}--start building`, '\033[0m')
	}
	else if (state === 'succeed') {
		console.log('\033[42;90m', `${moduleName}--build succeed`, '\033[0m')
	}
}
/**
 * 获取子项目名称
 */
let moduleNameList = (() => {
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
	if (moduleName !== '@all' && moduleName !== undefined) {// 单个modules打包
		if (moduleNameList.indexOf(moduleName) === -1) {// 判断参数名称是否存在于子项目中
			errorLog(`${moduleName} 项目不存在`)
		}
		else {
			buildLog(moduleName, 'start')
			exec(`vue-cli-service build ${moduleName}`, (err) => {if (err) console.log(err)})
					.stdout.on('data', data => console.log(data))
					.on('end', () => {
						buildLog(moduleName, 'succeed')
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
