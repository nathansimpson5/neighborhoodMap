// TODO: add info to infowindow
// TODO: add filter

var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]

var map;

// set up ko array for interacting with html
var markers = ko.observableArray();


function initMap() {

	// make map and center it on Atlantic House
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15,
	  center: {lat: 33.7861132, lng: -84.3896419},
	  styles: styles
	});

	// make list of places
	var places = [
		{name: "Arts Center Station", location: {lat: 33.789304, lng: -84.3891965}, type: "metro"},
		{name: "DaVinci's Pizza", location: {lat: 33.788992, lng: -84.3886788}, type: "pizza"},
		{name: "Foxtrot", location: {lat: 33.7857445, lng: -84.38633}, type: "cocktails/snacks"},
		{name: "Eleventh Street Pub", location: {lat: 33.7837559, lng: -84.3866712}, type: "dive bar"},
		{name: "Dancing Goats", location: {lat: 33.7811075, lng: -84.3867295}, type: "coffee"},
];

	var largeInfoWindow = new google.maps.InfoWindow();

	// set custom colors for icons
	var defaultIcon = makeMarkerIcon('c6e2ff');
	var selectedIcon = makeMarkerIcon('ffff66');

    //bounds handler
    var bounds = new google.maps.LatLngBounds();

	// iterate over list and make marker for each place
	for (var i=0; i < places.length; i++){
		var position = places[i].location;
		var title = places[i].name;
		var type = places[i].type;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i,
			type: type
		});
        //extend the bounds for each marker
        bounds.extend(position);

		markers.push(marker);

		//add click event for infowindow
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		});

		// make marker change color on mouseover
		marker.addListener('mouseover', function() {
			this.setIcon(selectedIcon);
		});

		// make marker go back to normal on mouse out
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

	}
    //fit the map to the bounds
    map.fitBounds(bounds);

	var placeSearchBox = document.getElementById('placeSearchBox');
	var options = {
		types: ['establishment']
	};

	autocomplete = new google.maps.places.Autocomplete(placeSearchBox, options);

// function to add content to infowindow
function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + ' | ' + marker.type + '</div>');
		infowindow.open(map, marker);

		infowindow.addListener('closeclick', function(){
			infowindow.setMarker = null;
		});
	}
}

//change marker color
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
	  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	  '|40|_|%E2%80%A2',
	  new google.maps.Size(21, 34),
	  new google.maps.Point(0, 0),
	  new google.maps.Point(10, 34),
	  new google.maps.Size(21,34));
	return markerImage;
}



};


//bind markers to html
ko.applyBindings(markers);