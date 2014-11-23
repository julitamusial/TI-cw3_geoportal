//Adding multiple title layers
var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; ' + osmLink + ' Contributors',
    landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
    thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink;

var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
    landMap = L.tileLayer(landUrl, {attribution: thunAttrib});

//Map initialization
var map = L.map('map', {
	    layers: [osmMap] // only add one!
    },{drawControl: true})
    .setView([51.11231,17.06429], 17);

var baseLayers = {
	"OSM Mapnik": osmMap,
	"Landscape": landMap
};

L.control.layers(baseLayers).addTo(map);


//Base map
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map dat &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 19
	}).addTo(map);
	

//Add wector layer from file
	$.getJSON("uczelnia_pol.geojson", function(data) {
		L.geoJson(data).addTo(map);
	});
	

//Add point layer from file
	$.getJSON("dziekanat.geojson", function(data){
		L.geoJson(data).addTo(map);
	});

//Add marker on map
	var marker;

	$('#add').click(function(){
		function onMapClick(e) {
		points = new L.Marker(e.latlng, {draggable: 'true'});
		map.addLayer(points);
		marker.bindPopup("<b>Pozycja Twojego punktu to: " + e.latlng.lat + " , " + e.latlng.lng).
		openPopup();
	};
	map.on('click', onMapClick);

	});

	$('#remove').click(function(){
	map.removeLayer(points);
});


//Add Leaflet.draw pluggin
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
            draw: {
            	polygon: {shapeOptions: {color: '#27ae60'}},
            	polyline: {shapeOptions: {color: '#8e44ad'}},
            	rect: {shapeOptions: {color: '#2980b9'}},
            	circle: {shapeOptions: {color: '#f1c40f'}},
            	},
            edit: {
                featureGroup: drawnItems
            }
        });
        map.addControl(drawControl);

        map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
            drawnItems.addLayer(layer);
        });
