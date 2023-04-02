// Create a map object
var myMap = L.map("map", {
    center: [39.7480, -102.0987],
    zoom: 4
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
}).addTo(myMap);

// URL to obtain earthquake GeoJSON data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// This function determines the colour of a earthquake depth based on the depth value
function Colour(depth) {
    if (depth <= 10) return "#54ff00"; 
    else if (depth > 10 && depth <= 30 ) return "#a1de00";
    else if (depth > 30 && depth <= 50 ) return "#ccba00";
    else if (depth > 50 && depth <= 70 ) return "#e99100";
    else if (depth > 70 && depth <= 90 ) return "#fa5f00";
    else return "#ff0000";                            
}
  

// Define circle layer
function CirclesLayer (point, latlng) {
    let mag = point.properties.mag;
    let depth = point.geometry.coordinates[2];

    return L.circle(latlng, {
            fillOpacity: 0.2,
            color: Colour(depth),
            fillColor: Colour(depth),
            radius: mag * 6000
    })
}

 // Bind a pop-up to each layer
 function onEachFeature(feature, layer) {
    layer.bindPopup(`<h1> ${feature.properties.title} </h1> <hr> Magnitude: ${feature.properties.mag}  <br> Location: ${feature.properties.place}<br> Depth: ${feature.geometry.coordinates[2]}`);
}

// Getting the GeoJSON data
d3.json(url).then((data) => {
    var features = data.features;

    // Creating a GeoJSON layer with the retrieved data
    L.geoJSON(features, {
        pointToLayer: CirclesLayer,
        onEachFeature: onEachFeature
    }).addTo(myMap);

    // Create the map legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = () => {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 10, 30, 50, 70, 90];

        // Loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Colour(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});