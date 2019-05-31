const glob = require('glob')
let log = errorText => console.log('\033[41;32m ERROR: \033[47;30m', errorText, '\033[0m') // 异常信息打印
let _errorLog = text => {throw new Error(log(text))} // 抛出异常
/**
 * 打包执行的信息打印
 * @param info 要打印的信息目标
 * @param state 状态码 字符串类型
 */
let _infoLog = (info, state) => {
		switch (state) {
				case 'start': {
						console.log('\033[44;30m', `${info}`, '\033[0m')
						break
				}
				case 'succeed': {
						console.log('\033[42;90m', `${info}`, '\033[0m')
						break
				}
				default: {
						console.log('\033[42;90m', `state参数不存在`, '\033[0m')
				}
		}
}
const npmParameter = JSON.parse(process.env.npm_config_argv).cooked[2]

let _moduleNameList = (() => {// 获取子项目名称列表
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
 * 获取运行时候的moduleName并进行验证
 */
let _moduleName = (() => {
		let moduleName = npmParameter ? npmParameter.replace(/^-+/g, '') : _errorLog('请输入命令参数') // 无参数提示
		if (_moduleNameList.indexOf(moduleName) !== -1) { // 项目存在 返回项目名称
				return moduleName
		}
		else if (moduleName === '@all') { // 全部打包参数的验证和返回
				return '@all'
		}
		else {
				_errorLog(`${npmParameter} 项目不存在`) //项目不存在抛出错误
		}
})()
module.exports = {
		_infoLog,
		_moduleNameList,
		_moduleName,
}
