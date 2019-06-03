const glob = require('glob')
/**
 * 判断是否是开发环境
 * @type {boolean}
 */
let isDevelopment = process.env.NODE_ENV === 'development'
/**
 * errorLog 错误抛出
 * @param errorInfo 抛出的错误信息内容
 */
let errorLog = (errorInfo) => {
		throw new Error(console.log('\033[41;32m ERROR: \033[47;30m', errorInfo, '\033[0m'))
}
/**
 * stateLog 打包执行的信息打印
 * @param state 状态码 字符串类型
 * @param info 要打印的信息目标
 */
let stateLog = (state, info) => {
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
/**
 * moduleNameList 获取子项目名称列表
 * @type {Array}
 * @private
 */
let moduleNameList = (() => {
		let htmlPathList = glob.sync('./src/modules/*/*.html')
		let moduleNameArray = []
		htmlPathList.map((fileName) => {
				moduleNameArray.push(fileName.split('/')[3])
		})
		return moduleNameArray
})()
/**
 * moduleName  获取运行参数的moduleName并进行验证是否存在于项目列表
 */
let moduleName = (() => {
		const npmParameter = JSON.parse(process.env.npm_config_argv).cooked[2]// 获取命令行--参数
		let moduleName = npmParameter ? npmParameter.replace(/^-+/g, '') : errorLog('请输入命令参数') // 无参数报错
		if (moduleNameList.indexOf(moduleName) !== -1 || moduleName === '@all') {return moduleName } // 项目存在或者为@all的时候返回参数字段
		else {errorLog(`${moduleName} 项目不存在`)} //项目不存在抛出错误
})()
module.exports = {
		isDevelopment,
		moduleNameList,
		moduleName,
		stateLog,
}
