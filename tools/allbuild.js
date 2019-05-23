let pr = require('child_process')
pr.exec('npm run build index && npm run build test1', function (err) {
	console.log(err)
})
