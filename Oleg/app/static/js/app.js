var url = "https://raw.githubusercontent.com/TNRIS/tx.geojson/master/counties/tx_counties.geojson";
var geojson_unempl;
var geojson_income;

d3.json(url, function (new_data) {  

  var myMap = L.map("txmap", {
    center: [31.3, -99.9018],
    zoom: 6
  });
  

  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);


  
  var unempURL = "/unemp";
  d3.json(unempURL, function(unemp_data){
    // console.log(unemp_data);


    for (i=0; i<new_data.features.length; i++){
      // console.log(new_data.features[i].properties.COUNTY);
      // console.log(unemp_data[i]);
        
      Object.entries(unemp_data).forEach(([key,value]) =>{
          if (key == new_data.features[i].properties.COUNTY){
            new_data.features[i].properties.UNEMPLOYMENT = value;
          }
        })
      
      // console.log(new_data.features[i]);

    }
    

  // var plates_layer = L.geoJson(new_data).addTo(myMap);

  geojson_unempl = L.choropleth(new_data, {

    // Define what  property in the features to use
    // valueProperty: "MHI",
    valueProperty: "UNEMPLOYMENT",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    
  });


//closing d3 call to unemployment
});










var incomeURL = "/income";
d3.json(incomeURL, function(income_data){

  for (i=0; i<new_data.features.length; i++){    
      
    Object.entries(income_data).forEach(([key,value]) =>{
        if (key == new_data.features[i].properties.COUNTY){
          new_data.features[i].properties.INCOME = value;
        }
      })
    
    console.log(new_data.features[i]);

  }
  

// var plates_layer = L.geoJson(new_data).addTo(myMap);

geojson_income = L.choropleth(new_data, {

  // Define what  property in the features to use
  // valueProperty: "MHI",
  valueProperty: "INCOME",

  // Set color scale
  scale: ["#ffffb2", "#016703"],

  // Number of breaks in step range
  steps: 10,

  // q for quartile, e for equidistant, k for k-means
  mode: "q",
  style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
  },
  
}).addTo(myMap);


//closing d3 call to income
});

//closing d3 call to original geojson
});