const child_process = require('child_process')
const exec = child_process.exec
const tools = require('./tools.js')
let moduleNameList = tools._moduleNameList
let moduleName = tools._moduleName
/**
 * 打包函数 build
 * @param moduleName 子项目名称
 */
let build = (moduleName) => {
		if (moduleName !== '@all') {// 单个modules打包
				tools._infoLog(`${moduleName} build start`, 'start')
				exec(`vue-cli-service build ${moduleName}`, (err) => {if (err) console.log(err)})
						.stdout.on('data', data => console.log(data))
						.on('end', () => {
								tools._infoLog(`${moduleName} build succeed`, 'succeed')
						})
		}
		else if (moduleName === '@all') {// 全部modules打包
				moduleNameList.forEach((item) => {
						exec(`npm run build ${item}`, (err) => {if (err) console.log(err)})
								.stdout.on('data', data => console.log(data))
				})
		}
}
build(moduleName)
