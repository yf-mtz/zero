const fs = require('fs')
const glob = require('glob')
let img = glob.sync('./src/modules/*/*.ico')
console.log(img)
fs.readFile(img[0], function (err, data) {
	console.log(data)
	// fs.writeFile('./public', data, function (err) {
	// 	if (err) {
	// 		console.log(err)
	// 	}
	// })
})
