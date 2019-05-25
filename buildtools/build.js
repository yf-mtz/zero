const glob = require('glob')
const fs = require('fs')
const child_process = require('child_process')
const exec = child_process.exec
const moduleName = process.argv[2]
const stat = fs.stat
/**
 * 打包执行的信息打印
 * @param name  模块名字
 * @param start 是否为开始阶段 布尔值
 */
let buildLog = (name, start) => {
	if (start) {
		start = '开始打包'
		console.log(' ---------------------------------')
		console.log(`|        ${name}--${start}          |`)
		console.log(' ---------------------------------')
	}
	else {
		start = '打包完成'
		console.log(' ..................................')
		console.log(` .        ${name}--${start}         .`)
		console.log(' ..................................')
	}
}
/**
 * 子项目public文件夹复制
 * @param name 子项目名称
 */
let copyPublic = (name) => {
	let copy = (src, dst) => {
		//读取文件
		fs.readdir(src, (err, paths) => {
			if (err) {throw err}
			paths.forEach((path) => {
				// 读取文件路径和写入文件路径
				let _src = `${src}/${path}`
				let _dst = `${dst}/${path}`
				/**
				 * @param _src 读取文件路径
				 * @param err  错误信息
				 * @param stats 子文件信息
				 */
				stat(_src, (err, stats) => {
					if (err) {throw err}
					if (stats.isFile()) {// 是文件的情况
						let readable = fs.createReadStream(_src)//创建读取流
						let writable = fs.createWriteStream(_dst)//创建写入流
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
	let exists = (src, dst, callback) => {
		//测试路径下文件是否存在 不存在创建文件
		fs.exists(dst, (exists) => {
			if (exists) {callback(src, dst)}
			else {fs.mkdir(dst, () => {callback(src, dst)})}
		})
	}
	exists(`./src/modules/${name}/public`, `./dist/${name}/`, copy)
	console.log(' ..................................')
	console.log(` .   ${name}--public文件拷贝完成    .`)
	console.log(' ..................................')
}
/**
 * build执行函数
 * @param moduleName 子项目名称
 */
let buildModule = (moduleName) => {
	if (moduleName === 'all') {//错误命令提示
		throw  new Error('build全部modules项目请使用 npm run build @all')
	}
	else if (moduleName !== '@all') {//单个modules打包
		buildLog(moduleName, true)
		exec(`vue-cli-service build ${moduleName}`, (err) => {
			if (err) console.log(err)
		}).stdout.on('data', data => console.log(data)).on('end', () => {
			buildLog(moduleName)
			copyPublic(moduleName)
		})
	}
	else if (moduleName === '@all') {//全部modules打包
		/**
		 * getModuleNameList 获取所有项目的html文件名称 返回名称数组
		 * @returns {Array} 返回moduleNameList数组
		 */
		let getModuleNameList = () => {
			let htmlPathList = glob.sync('./src/modules/*/*.html')
			let moduleNameList = []
			for (let i in htmlPathList) {
				let filePath = htmlPathList[i]
				let fileList = filePath.split('/')
				let fileName = fileList[fileList.length - 2]
				moduleNameList.push(fileName)
			}
			return moduleNameList
		}
		/**
		 * buildAllModules 遍历打包全部module
		 * @param moduleNameList
		 */
		let buildAllModules = (moduleNameList) => {
			moduleNameList.forEach((moduleName) => {
				buildLog(moduleName, true)
				exec(`npm run build ${moduleName}`, (err) => {
					if (err) console.log(err)
				}).stdout.on('end', () => {
					buildLog(moduleName)
					copyPublic(moduleName)
				})
			})
		}
		buildAllModules(getModuleNameList())
	}
}
buildModule(moduleName)
