import sqlite3
import threading
import time
import queue
from time import strftime
 
import feedparser     # available at http://feedparser.org
 
 
THREAD_LIMIT = 20
jobs = queue.Queue(0)
rss_to_process = queue.Queue(THREAD_LIMIT)
 
DATABASE = "rss.sqlite"
 
conn = sqlite3.connect(DATABASE)
conn.row_factory = sqlite3.Row
c = conn.cursor()
 
#insert initial values into feed database
c.execute('CREATE TABLE IF NOT EXISTS RSSFeeds (id INTEGER PRIMARY KEY AUTOINCREMENT, url VARCHAR(1000));')
c.execute('CREATE TABLE IF NOT EXISTS RSSEntries (entry_id INTEGER PRIMARY KEY AUTOINCREMENT, id, url, title, content, date);')
c.execute("INSERT INTO RSSFeeds(url) VALUES('http://feeds.enviroflash.info/rss/realtime/60.xml?id=9620423B-A942-33E7-094004C677B90C6B');")
 
feeds = c.execute('SELECT id, url FROM RSSFeeds').fetchall()
 
def store_feed_items(id, items):
    """ Takes a feed_id and a list of items and stored them in the DB """
    for entry in items:
        c.execute('SELECT entry_id from RSSEntries WHERE url=?', (entry.link,))
        if len(c.fetchall()) == 0:
            c.execute('INSERT INTO RSSEntries (id, url, title, content, date) VALUES (?,?,?,?,?)', (id, entry.link, entry.title, entry.summary, strftime("%Y-%m-%d %H:%M:%S",entry.updated_parsed)))
 
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