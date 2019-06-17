import sqlite3
import threading
import time
import queue
from time import strftime
 
import feedparser 
 
 
THREAD_LIMIT = 20
jobs = queue.Queue(0)
rss_to_process = queue.Queue(THREAD_LIMIT)
 
DATABASE = "aqi.sqlite"
 
conn = sqlite3.connect(DATABASE)
conn.row_factory = sqlite3.Row
c = conn.cursor()
 
#insert initial values into feed database
# c.execute('CREATE TABLE IF NOT EXISTS CurrentObs (id INTEGER PRIMARY KEY AUTOINCREMENT, url VARCHAR(1000));')
# c.execute('CREATE TABLE IF NOT EXISTS CurrentObs (entry_id INTEGER PRIMARY KEY AUTOINCREMENT, id, url, title, content, date);')
c.execute("INSERT INTO RSSFeeds(url) VALUES('http://www.airnowapi.org/aq/data/?startDate=2019-06-15T20&endDate=2019-06-15T21&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-108.200607,25.549560,-92.643967,37.846387&dataType=A&format=application/json&verbose=1&nowcastonly=0&API_KEY=9EFBDC3F-9727-474B-8AC4-B950F718C9C7');")

c.execute('''CREATE TABLE IF NOT EXISTS "CurrentObs" (
	"entry_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"dateObserved"	TEXT,
	"hourObserved"	NUMERIC,
	"localTimeZone"	TEXT,
	"reportingArea"	TEXT,
	"stateCode"	TEXT,
	"latitude"	NUMERIC,
	"longitude"	NUMERIC,
	"parameterName"	TEXT,
	"aqi"	NUMERIC,
	"categoryNumber"	NUMERIC,
	"categoryName"	TEXT
)''')
 
feeds = c.execute('SELECT id, url FROM RSSFeeds').fetchall()
 
def store_feed_items(id, items):
    """ Takes a feed_id and a list of items and stored them in the DB """
    for entry in items:
        c.execute('SELECT entry_id from CurrentObs WHERE url=?', (entry.link,))
        if len(c.fetchall()) == 0:
            c.execute('INSERT INTO CurrentObs (DateObserved,HourObserved,LocalTimeZone,ReportingArea,StateCode,Latitude,Longitude,ParameterName,AQI,CategoryNumber,CategoryName) VALUES (?,?,?,?,?,?,?,?,?,?,?)', (id, entry.link, entry.title, entry.summary, strftime("%Y-%m-%d %H:%M:%S",entry.updated_parsed)))
            
 
def thread():
    while True:
        try:
            id, feed_url = jobs.get(False) # False = Don't wait
        except queue.Empty:
            return
 
        entries = feedparser.parse(feed_url).entries
        rss_to_process.put((id, entries), True) # This will block if full
 
for info in feeds: # Queue them up
    jobs.put([info['id'], info['url']])
 
# for n in xrange(THREAD_LIMIT):
#     t = threading.Thread(target=thread)
#     t.start()
 
while threading.activeCount() > 1 or not rss_to_process.empty():
    # That condition means we want to do this loop if there are threads
    # running OR there's stuff to process
    try:
        id, entries = rss_to_process.get(False, 1) # Wait for up to a second
    except queue.Empty:
        continue
 
    store_feed_items(id, entries)
 
conn.commit()