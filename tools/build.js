const exec = require('child_process').exec
const tools = require('./utils.js')
let moduleNameList = tools._moduleNameList
let moduleName = tools._moduleName
let stateLog = tools._stateLog
/**
 * build 项目运行打包
 * @param moduleName 子项目名称
 */
let build = (moduleName) => {
		if (moduleName !== '@all') {// 单个modules打包
				stateLog('start', `${moduleName} build start`)
				exec(`vue-cli-service build ${moduleName}`, (err) => {if (err) console.log(err)})
						.stdout.on('data', data => console.log(data))
						.on('end', () => {
								stateLog('succeed',`${moduleName} build succeed`)
						})
		}
		else {// 全部modules打包
				moduleNameList.forEach((item) => {
						exec(`npm run build ${item}`, (err) => {if (err) console.log(err)})
								.stdout.on('data', data => console.log(data))
				})
		}
}
build(moduleName)
