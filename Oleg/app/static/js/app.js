console.log("first message ");

var url = "https://raw.githubusercontent.com/TNRIS/tx.geojson/master/counties/tx_counties.geojson";
console.log("first message1 ");

d3.json(url, function (new_data) {
  console.log("first message 2");

var myMap = L.map("txmap", {
    center: [31.3, -99.9018],    
    zoom: 6
  });
console.log("Oleg texs");

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  console.log("another message");


    var plates_layer = L.geoJson(new_data).addTo(myMap);
  });