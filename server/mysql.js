import { createConnection } from 'mysql';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(GetResourcePath(GetCurrentResourceName()), './.env') });

const con = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

con.connect(err => {
	if (err) return console.error(err);
  
	console.log("\x1b[33m[zFramework MySQL] \x1b[32mConnected to Database!\x1b[37m");
	zFramework.Functions.onReady();
});

zFramework.DB.Query = (q, args) => {
	return new Promise((resolve, reject) => {
		con.query(q, args, function(err, result) {
			if (err) return reject(err);
			
			return resolve(result);
		});
	});
}