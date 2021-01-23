fx_version 'cerulean'
game 'gta5'

author 'zirconiium'
version '1.0.0'

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

dependency 'yarn'