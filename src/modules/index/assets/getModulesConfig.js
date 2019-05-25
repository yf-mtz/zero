const configArray = require.context('../../../', true, /config.json/).keys()
let modulesConfig = []
configArray.map((item)=>{
	let moduleName = (item.split('/')[2])
	let config = require(`../../${moduleName}/config.json`)
	modulesConfig.push(config)
})
export {modulesConfig}
