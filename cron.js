const Agenda = require("agenda");
const sqlite3 = require('sqlite3').verbose();
const moment = require("moment")
const axios = require('axios').default;

const mongoConnectionString = "mongodb://127.0.0.1/agenda";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

const dbFile = __dirname + "/src/db.db";
//const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database(dbFile);

function checkdate(rows){

	for(i=0;i<rows.length;i++){
		
		if( !rows[i]["yearprocessed"] && 
		moment(rows[i]["bdate"]).add(parseInt(rows[i]["location"]),'hours').format('HH') == moment().format('HH') && 
		moment(rows[i]["bdate"]).format('MM') == moment().format('MM') && 
		moment(rows[i]["bdate"]).format('DD') == moment().format('DD') && 
		rows[i]["yearprocessed"] != moment().format('YYYY')
		){
			greet = "Hey, "+rows[i]["firstname"]+" it's your birthday"
			console.log(greet)
			
			//send to hookbin
			axios.post('https://hookbin.com/mZ0ObxZbRkUlzXNNnJe2',  greet)
			  .then(function (result) {			    
			    //console.log(result)
			  })
			  .catch(function (error) {
			    //console.log(error);
			  });
			  
			  //update yearprocessed flag back to database
			  var values = [moment().format('YYYY'),rows[i]["userID"]];
			  const result = db.run('update user set yearprocessed = ? where userID=?', values, function 	(err) {
			    if (err) {
				console.log({
				    error_code: 'SERVER_ERROR',
				    message: err.message
				});
			    }

			    
			});
			  
		}
	} 
	
}

agenda.define("hi", async (job) => {
	await db.all('SELECT * FROM user ',function (err, rows) {
                if (err) {
                    return console.log({
                        error_code: 'SERVER_ERROR',
                        message: err.message
                    });
                }
                checkdate(rows)

                console.log(rows);
	});
  
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  await agenda.every("1 minutes", "hi");

  
})();
