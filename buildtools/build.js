const glob = require('glob')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const exec = child_process.exec
const module_name = process.argv[2]
const stat = fs.stat
/**
 * 子项目public文件夹复制
 * @param name 子项目名称
 */
let copyPublic = (name) => {
	let copy = (src, dst) => {
		//读取文件
		fs.readdir(src, (err, paths) => {
			if (err) {
				throw err
			}
			paths.forEach((path) => {
				let _src = `${src}/${path}`
				let _dst = `${dst}/${path}`
				stat(_src,  (err, st)=> {
					if (err) {
						throw err
					}
					if (st.isFile()) {
						let readable = fs.createReadStream(_src)//创建读取流
						let writable = fs.createWriteStream(_dst)//创建写入流
						readable.pipe(writable)
					}
					else if (st.isDirectory()) {
						exists(_src, _dst, copy)
					}
				})
			})
		})
	}
	/**
	 *
	 * @param src 子项目public文件夹
	 * @param dst dist之后的子项目文件夹
	 * @param callback 调用写入函数
	 */
	let exists = (src, dst, callback) => {
		//测试某个路径下文件是否存在 不存在创建文件
		fs.exists(dst, (exists) => {
			if (exists) {
				callback(src, dst)
			}
			else {
				fs.mkdir(dst, () => {
					callback(src, dst)
				})
			}
		})
	}
	exists(`./src/modules/${name}/public`, `./dist/${name}/`, copy)
	console.log(`${name}--public文件拷贝完成`)
}
/**
 * 打包写入favicon.icon图标
 * @param name 传入模块名称
 */
let copyFavicon = (name) => {
	const fileName = 'favicon.ico'
	let sourceFile = path.join(__dirname, `../src/modules/${name}`, fileName)
	let destinationPath = path.join(__dirname, `../dist/${name}`, fileName)
	let readIcon = fs.createReadStream(sourceFile)
	let writeIcon = fs.createWriteStream(destinationPath)
	readIcon.pipe(writeIcon)
	console.log(`${name}--favicon.ico拷贝完成`)
}

let buildLog = (name, state) => {
	state ? state = '开始打包' : state = '打包完成'
	if (state === '开始打包') {
		console.log(' ---------------------------------')
		console.log(`|                                 |`)
		console.log(`|          ${name}--${state}        |`)
		console.log(`|                                 |`)
		console.log(' ---------------------------------')
	}
	else {
		console.log(' ..................................')
		console.log(' .                                .')
		console.log(` .          ${name}--${state}       .`)
		console.log(' .                                .')
		console.log(' ..................................')
	}
}

let buildFun = (name) => {
	if (name !== 'all') {
		buildLog(name, true)
		let e = exec(`vue-cli-service build ${name}`, (err) => {
			if (err) console.log(err)
		})
		e.stdout.on('end', () => {
			buildLog(name)
			copyPublic(name)
			copyFavicon(name)
		})
	}
	else if (name === 'all') {
		/**
		 * getHtmlList 获取所有项目的html文件名称 返回名称数组
		 * @returns {Array}
		 */
		let getHtmlList = () => {
			let htmlPathList = glob.sync('./src/modules/*/*.html')
			let htmlList = []
			for (let i in htmlPathList) {
				let filePath = htmlPathList[i]
				let fileList = filePath.split('/')
				let fileName = fileList[fileList.length - 2]
				htmlList.push(fileName)
			}
			return htmlList
		}
		/**
		 * 遍历执行打包动作 打包所有项目
		 */
		((res => {
			res.forEach((name) => {
				buildLog(name, true)
				let e = exec(`npm run build ${name}`, (err) => {
					if (err) console.log(err)
				})
				e.stdout.on('end', () => {
					buildLog(name)
					copyPublic(name)
					copyFavicon(name)
				})
			})
		})(getHtmlList()))
	}
}
buildFun(module_name)
