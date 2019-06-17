import sqlite3
import pull_tx
 
conn = sqlite3.connect(DATABASE)
conn.row_factory = sqlite3.Row
c = conn.cursor()


db = sqlite3.connect("aqi.sqlite")
c = db.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS "aqi_output" (
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

c.execute("insert into aqi_output VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", keys)

import json
import sqlite3

traffic = json.load(open('xxx.json'))
db = sqlite3.connect("fluxos.sqlite")

query = "insert into aqi_output values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
columns = ['site_autoid', 'Longitude', 'Latitude', 'UTC', 'Parameter', 'Unit', 'Value', 'AQI', 'Category']
for timestamp, data in traffic.iteritems():
    keys = (timestamp,) + tuple(data[c] for c in columns)
    c = db.cursor()
    c.execute(query, keys)
    c.close()