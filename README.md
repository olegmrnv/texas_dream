# Multi-factor analysis for selecting best place to live in Texas
#
## Contributors: Oleg Mironov, Kundyz Smith, Amy Reynolds

### Tools used:
 - Javascript libraries: IfVisible.js, Leaflet.js, D3.js., choropleth
 - Python libraries: pandas, Sqlalchemy, Flask, json
 - Database: SQLite
#
 - SQLite was used to store data for income by TX county, unemployment by TX County Population by TX County, school ratings by TX County, air quality by TX monitoring stations.
#
 - ifVisible.js listener to track end user activity
 - Leaflet.js was used to create the base map and markers for school ratings and air quality
 - choropleth.js created layers and color range visualization for income and unemployment
 - D3.js was used to obtain the geographic lat/long for geoJSON boundary polygons
 - geoJSON was used to create boundary polygons
