// Initialize the Leaflet map
var mymap = L.map('map').setView([51.505, -0.09], 2); // default coordinates

// Set the tile layer (base map layer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mymap);

// Function to calculate marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 50000; // change this value to alter the size of the marker
}

// Function to calculate marker color based on depth
function depthColor(depth) {
    return depth > 100 ? '#800026' :
           depth > 80  ? '#BD0026' :
           depth > 60  ? '#E31A1C' :
           depth > 40  ? '#FC4E2A' :
           depth > 20  ? '#FD8D3C' :
           depth > 10  ? '#FEB24C' :
                         '#FED976'; 
}

// Fetch data from the API
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
.then(response => response.json())
.then(data => {
    // Go through each earthquake in the data
    for (let earthquake of data.features) {
        // Get the coordinates and depth of the earthquake
        let coords = earthquake.geometry.coordinates;
        let depth = coords[2];
        // Get the magnitude of the earthquake
        let magnitude = earthquake.properties.mag;
        // Add a circle to the map at the earthquake location
        L.circle([coords[1], coords[0]], {
            fillOpacity: 0.75,
            color: "white",
            weight: 1,
            fillColor: depthColor(depth), // color based on depth
            radius: markerSize(magnitude)  // size based on magnitude
        }).addTo(mymap)
        .bindPopup("<strong>Magnitude:</strong> " + magnitude + "<br><strong>Depth:</strong> " + depth + "<br><strong>Location:</strong> " + earthquake.properties.place);
    }

    // Set up the legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 40, 60, 80, 100],
            labels = [];

        // Loop through depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + depthColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(mymap);
});
