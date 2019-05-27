const glob = require('glob')
const fs = require('fs')
const child_process = require('child_process')
const exec = child_process.exec
const moduleName = process.argv[2]
const stat = fs.stat
/**
 * 打包执行的信息打印
 * @param moduleName  模块名字
 * @param isStart 是否为开始阶段 布尔值
 */
let buildLog = (moduleName, isStart) => {
	if (isStart) {
		console.log(` ---------------------------------
|        ${moduleName}--开始打包          |
 ---------------------------------`)
	}
	else {
		console.log(` .................................
:        ${moduleName}--打包完成          :
 .................................`)
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
				// 读取文件路径和写入文件路径
				let _src = `${src}/${path}`
				let _dst = `${dst}/${path}`
				stat(_src, (err, stats) => {
					if (err) {throw err}
					if (stats.isFile()) {// 是文件的情况
						let readable = fs.createReadStream(_src) //创建读取流
						let writable = fs.createWriteStream(_dst) //创建写入流
						readable.pipe(writable)
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
	let exists = ((src, dst, callback) => {
		//检测路径下文件是否存在 不存在创建文件
		fs.exists(dst, (exists) => {exists ? callback(src, dst) : fs.mkdir(dst, () => {callback(src, dst)})})
	})(`./src/modules/${moduleName}/public`, `./dist/${moduleName}/`, copy)
	buildLog(moduleName, false)
}
/**
 * 打包函数
 * @param moduleName 子项目名称
 */
((moduleName) => {
	if (moduleName === 'all') {//错误命令提示
		throw  new Error('build全部modules项目请使用 npm run build @all')
	}
	else if (moduleName !== '@all') {//单个modules打包
		buildLog(moduleName, true)
		exec(`vue-cli-service build ${moduleName}`, (err) => {
			if (err) console.log(err)
		}).stdout.on('data', data => console.log(data)).on('end', () => {
			copyPublic(moduleName)
		})
	}
	else if (moduleName === '@all') {//全部modules打包
		(() => {
			let htmlPathList = glob.sync('./src/modules/*/public/*.html')
			let moduleNameList = []
			for (let i in htmlPathList) {
				let filePath = htmlPathList[i]
				let fileList = filePath.split('/')
				let fileName = fileList[fileList.length - 3]
				moduleNameList.push(fileName)
			}
			moduleNameList.forEach((moduleName) => {
				buildLog(moduleName, true)
				exec(`npm run build ${moduleName}`, (err) => {if (err) console.log(err)}).stdout.on('end', () => {copyPublic(moduleName)})
			})
		})()
	}
})(moduleName)
