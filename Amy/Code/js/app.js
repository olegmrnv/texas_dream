var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/demodb02');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS ouput (site_autoid, value INTEGER)");
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
});
    db.run('''CREATE TABLE IF NOT EXISTS output (
	"site_autoid"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Longitude"	NUMERIC,
	"Latitude"	NUMERIC,
	"UTC"	TEXT,
	"Parameter"	TEXT,
	"Unit"	TEXT,
	"Value"	NUMERIC,
	"AQI"	NUMERIC,
	"Category"	NUMERIC,
	"SiteName"	TEXT,
	"AgencyName"	TEXT,
	"FullAQSCode"	NUMERIC,
	"IntlAQSCode"	NUMERIC
)''')


var express = require('express');
var restapi = express();

restapi.get('/data', function(req, res){
    db.get("SELECT value FROM counts", function(err, row){
        res.json({ "count" : row.value });
    });
});

restapi.post('/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});


restapi.listen(3000);

console.log("Submit GET or POST to http://localhost:3000/data");