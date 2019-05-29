const glob = require('glob')
const fs = require('fs')
const child_process = require('child_process')
const exec = child_process.exec
let errorLog = (text) => {
	console.log('\033[41;32m Error: \033[47;30m', text, '\033[0m')
	return
}
const npmParameter = JSON.parse(process.env.npm_config_argv).cooked[2] //获取build运行命令的参数
const moduleName = npmParameter ? npmParameter.replace(/^-+/g, '') : errorLog('build命令必须有参数')
const stat = fs.stat
/**
 * buildError 错误信息
 * @param text 要输出的文字内容
 */

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
 * 子项目public文件夹复制
 * @param moduleName 模块名字
 */
let copyPublic = (moduleName) => {
	let copy = (src, dst) => {
		//读取文件
		fs.readdir(src, (err, paths) => {
			if (err) {throw err}
			paths.forEach((path) => {
				let _src = `${src}/${path}`// 读取文件路径
				let _dst = `${dst}/${path}`// 写入文件路径
				let reg = new RegExp(`${moduleName}\.html`)
				stat(_src, (err, stats) => {
					if (err) {throw err}
					if (stats.isFile()) {// 是文件的情况
						if (!reg.test(path)) {// 检测是否是html入口文件 如果是则不复制
							let readable = fs.createReadStream(_src) //创建读取流
							let writable = fs.createWriteStream(_dst) //创建写入流
							readable.pipe(writable)
						}
					}
					else if (stats.isDirectory()) {exists(_src, _dst, copy)}// 是文件夹的情况
				})
			})
		})
	}
	/**
	 * exists判断目标文件夹的文件是否存在
	 * @param src 子项目public文件夹
	 * @param dst dist目标文件夹
	 * @param callback 传入copy函数
	 */
	let exists = ((src, dst, callback) => {//检测路径下文件是否存在 不存在创建文件
		fs.exists(dst, (exists) => {
			exists ? callback(src, dst) : fs.mkdir(dst, () => {callback(src, dst)})
		})
	})
	exists(`./src/modules/${moduleName}/public`, `./dist/${moduleName}`, copy)
	buildLog(moduleName, 'succeed')
}
/**
 * 获取子项目名称
 */
let moduleNameList = (() => {
	let htmlPathList = glob.sync('./src/modules/*/public/*.html')
	let moduleNameArray = []
	for (let i in htmlPathList) {
		let filePath = htmlPathList[i]
		let fileList = filePath.split('/')
		let fileName = fileList[fileList.length - 3]
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
						copyPublic(moduleName)
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
