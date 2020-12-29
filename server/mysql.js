import { createConnection } from 'mysql';

const con = createConnection({
	host: "localhost",
	user: "root",
	password: "XsQ[Fe!&!}ft.7x6",
	database: "zframework"
});

con.connect(async function(err) {
	if (err) return console.error(err);
  
	console.log("\x1b[33m[zFramework MySQL] \x1b[32mConnected to Database!\x1b[37m");
	zFramework.Functions.onReady();
});

zFramework.DB.Query = (q, args) => {
	return new Promise((resolve, reject) => {
		con.query(q, args, function(err, result) {
			if (err) {
				console.error(err.stack);
				return reject(err);
			}
			resolve(result);
		});
	});
}