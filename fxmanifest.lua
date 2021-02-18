fx_version 'cerulean'
game 'gta5'

author 'zirconiium'

client_scripts {
	'zFramework.js',
	'dist/shared/*.js',
	'dist/client/*.js'
}

server_scripts {
	'config.js', -- need to ditch that shit
	'zFramework.js',
	'dist/shared/*.js',
	'dist/server/*.js'
}

ui_page {
	'ui/index.html'
}

files {
	'ui/index.html',
	'ui/main.js',
	'ui/assets/img/items/*.png',
	'config/**/*.json'
}

dependency 'yarn'