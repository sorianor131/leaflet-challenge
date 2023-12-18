// Part 1: Create the Earthquake Visualization

// Assemble the API query URL.
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    console.log(data);
    // Create createFeatures function
    createFeatures(data.features);
});
function createFeatures(earthquakeData) {
    // The function that will determine the marker color by depth
    function chooseColor(depth) {
        if (depth < 10) return '#98ee00';
        else if (depth < 30) return '#d4ee00';
        else if (depth < 50) return '#eecc00';
        else if (depth < 70) return '#ee9c00';
        else if (depth < 90) return '#ea822c';
        else return '#ea2c2c';
    }

// This is called on each feature
    function onEachFeature(feature, layer) {   
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    // Creating a GeoJSON layer with the retrieved data
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                color: 'white',
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                weight: 1.5,
            });
        },
        onEachFeature: onEachFeature
    });

    // CreateMap with earthquakes layer
    createMap(earthquakes);
};

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      'Street Map': streetmap,
    };
  
    // Create an overlay object to hold the earthquakes layer.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map object with options.
    let myMap = L.map('map', {
      center: [37.09, -95.71],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend.
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        console.log("Legend onAdd function is executing.");

        let div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90];
        colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        console.log("Creating legend div element.");

    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " + depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
    }
    console.log("Legend creation complete.");
    return div;
  };
  legend.addTo(myMap);
};