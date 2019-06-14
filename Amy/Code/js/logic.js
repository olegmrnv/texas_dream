// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  EMPLOYMENT: new L.LayerGroup(),
  INCOME: new L.LayerGroup(),
  SCHOOL_RATING: new L.LayerGroup(),
  Age_Range: new L.LayerGroup(),
  POLUTION: new L.LayerGroup(),
  Allergens: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [31.4274, -94.8085],
  zoom: 5,
  layers: [
    layers.EMPLOYMENT,
    layers.INCOME,
    layers.SCHOOL_RATING,
    layers.Age_Range,
    layers.POLUTION,
    layers.Allergens
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Employment": layers.EMPLOYMENT,
  "Income": layers.INCOME,
  "School Rating": layers.SCHOOL_RATING,
  "Age Range": layers.Age_Range,
  "Polution": layers.POLUTION,
  "Allergens": layers.Allergens,
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  EMPLOYMENT: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  INCOME: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "pink",
    shape: "star"
  }),
  SCHOOL_RATING: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  Age_Range: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "circle"
  }),
  POLUTION: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "orange",
    shape: "penta"
  }),
  Allergens: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "green",
    shape: "penta"
  })
};

// Perform an API call 
d3.json("http://feeds.airnowapi.org/rss/realtime/903.xml", function (infoRes) {

  // When the first API call is complete, perform another call 
  d3.json("http://feeds.airnowapi.org/rss/realtime/903.xml", function (statusRes) {
    var updatedAt = infoRes.last_updated;
    vartatus = statusRes.data.stations;
    var stationInfo = infoRes.data.stations;

    // Create an object to keep of the number of markers in each layer
    var parameterCount = {
      EMPLOYMENT: 0,
      INCOME: 0,
      SCHOOL_RATING: 0,
      Age_Range: 0,
      POLUTION: 0,
      Allergens: 0,
    };

    // Initialize atatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    // vartatusCode;

    // Loop through the (they're the same size and have partially matching data)
    // for (var i = 0; i < stationInfo.length; i++) {

      // Create a new station object with properties of both station objects
      // var station = Object.assign({}, stationInfo[i],tatus[i]);
      // If a station is listed but not installed, it's Employment
      // if (!station.is_installed) {
      //  tatusCode = "EMPLOYMENT";
      // }
      // If a station has no bikes available, it's SCHOOL_RATING
      // else if (!station.num_bikes_available) {
      //  tatusCode = "SCHOOL_RATING";
      // }
      // If a station is installed but isn't renting, it's Age_Range
      // else if (station.is_installed && !station.is_renting) {
      //  tatusCode = "Age_Range";
      // }
      // If a station has less than 5 bikes, it's status is POLUTION
      // else if (station.num_bikes_available < 5) {
      //  tatusCode = "POLUTION";
      // }
      // Otherwise the station is Allergens
      // else {
      //  tatusCode = "Allergens";
      // }

      // Update the station count
      // parameterCount[stationStatusCode]++;
      // Create a new marker with the appropriate icon and coordinates
      // var newMarker = L.marker([station.lat, station.lon], {
        // icon: icons[stationStatusCode]
      // });

      // Add the new marker to the appropriate layer
      // newMarker.addTo(layers[stationStatusCode]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      // newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
    // }

    // Call the updateLegend function, which will... update the legend!
    updateLegend(updatedAt, parameterCount);
  });
});

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, parameterCount) {
  document.querySelector(".legend").innerHTML = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='INCOME'>Income: " + parameterCount.Age_Range + "</p>",
    "<p class='age_range'>Age_Range: " + parameterCount.Age_Range + "</p>",
    "<p class='employment'>Employment: " + parameterCount.EMPLOYMENT + "</p>",
    "<p class='SCHOOL_RATING'>SCHOOL_RATING: " + parameterCount.SCHOOL_RATING + "</p>",
    "<p class='POLUTION'>POLUTION: " + parameterCount.POLUTION + "</p>",
    "<p class='Allergens'>ALLERGENS: " + parameterCount.Allergens + "</p>"
  ].join("");
}
