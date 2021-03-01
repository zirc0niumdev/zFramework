import { createConnection } from 'mysql';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(GetResourcePath(GetCurrentResourceName()), './.env') });

const mysql = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

const connect = mysql.connect(err => {
	if (err) return console.error(err);
  
	console.log("\x1b[33m[zFramework MySQL] \x1b[32mConnected to Database!\x1b[37m");
	zFramework.Functions.onReady();
});

mysql.on('error', err => {
	if (err.code === 'PROTOCOL_CONNECTION_LOST') connect();
});

zFramework.Database.Query = (q, args) => {
	try {
		return new Promise((resolve, reject) => {
			mysql.query(q, args, function(err, result) {
				if (err) reject(`FAILED: ${err.code} - ${err.sqlMessage}`);
				
				resolve(result);
			});
		});
	} catch(err) {
		console.log(err);
	}
}