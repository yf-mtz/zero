let errorLog = errorText => console.log('\033[41;32m ERROR: \033[47;30m', errorText, '\033[0m') // 异常信息打印
let error = text => {throw new Error(errorLog(text))} // 抛出异常
/**
 * 打包执行的信息打印
 * @param moduleName  模块名字
 * @param state 状态字符串l
 */

let log = (moduleName, state) => {
	if ((/start$/).test(state)) {
		console.log('\033[44;30m', `${moduleName}--${state}`, '\033[0m')
	}
	else if ((/succeed$/).test(state)) {
		console.log('\033[42;90m', `${moduleName}--${state}`, '\033[0m')
	}
}
module.exports = {
	error,
	log
}
