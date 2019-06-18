import os
import sys
import json
import pandas as pd
from datetime import datetime
from os.path import expanduser
import urllib3
from config import API_KEY
# create today date variable

def main():

    # API parameters
    options = {}
    options["url"] = "https://airnowapi.org/aq/data/"
    options["start_date"] = "2019-06-17"
    options["start_hour_utc"] = "15"
    options["end_date"] = "2019-06-17"
    options["end_hour_utc"] = "23"
    options["parameters"] = "o3,pm25"
    options["bbox"] = "-107.027060,25.632792,-93.228232,36.731120"
    options["data_type"] = "a"
    options["format"] = "application/json"
    options["verbose"] = "1"
    options["ext"] = "kml"
    options["api_key"] = API_KEY

    # API request URL
    REQUEST_URL = options["url"] \
                  + "?startdate=" + options["start_date"] \
                  + "t" + options["start_hour_utc"] \
                  + "&enddate=" + options["end_date"] \
                  + "t" + options["end_hour_utc"] \
                  + "&parameters=" + options["parameters"] \
                  + "&bbox=" + options["bbox"] \
                  + "&datatype=" + options["data_type"] \
                  + "&format=" + options["format"] \
                  + "&verbose=" + options["verbose"] \
                  + "&api_key=" + options["api_key"]

    try:
        # Request AirNowAPI data
        print ("Requesting AirNowAPI data...")

        # User's home directory.
        home_dir = expanduser("~")
        download_file_name = "AirNowAPI" + datetime.now().strftime("_%Y%M%d%H%M%S." + options["ext"])
        download_file = os.path.join(home_dir, download_file_name)

        # Perform the AirNow API data request
        api_data = urllib3.PoolManager()
        resp = api_data.request('GET',REQUEST_URL)

        # Download complete
        print ("Download URL: %s" % REQUEST_URL)
        print ("Download File: %s" % resp.data)
        return resp.data

    except Exception as e:
        print ("Unable perform AirNowAPI request. %s" % e)
        sys.exit(1)
        if __name__ == "__main__":
    main()

    x = main()
    output_aqi = pd.read_json(x)
    output_aqi
    
DATABASE = "aqi.sqlite"

c.execute('''CREATE TABLE IF NOT EXISTS "output" (
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
                               
from sqlalchemy import create_engine
engine = create_engine('sqlite:///aqi.sqlite', echo=False)
from sqlalchemy import inspect
inspector = inspect(engine)

for table_name in inspector.get_table_names():
    print(table_name)

  output_aqi.columns  
  output_aqi.to_sql('output', con=engine, if_exists='append', index=False)