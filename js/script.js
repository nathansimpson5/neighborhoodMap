// TODO: iterate over knockout array to add items on left
// TODO: add info to infowindow

var map;

var markers = [];


function initMap() {

	// make map and center it on Atlantic House
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15,
	  center: {lat: 33.7861132, lng: -84.3896419}
	});

	// make list of places
	var places = [
		{name: "Arts Center Station", location: {lat: 33.789304, lng: -84.3891965}},
		{name: "DaVinci's Pizza", location: {lat: 33.788992, lng: -84.3886788}},
		{name: "Foxtrot", location: {lat: 33.7857445, lng: -84.38633}},
		{name: "Eleventh Street Pub", location: {lat: 33.7837559, lng: -84.3866712}},
		{name: "Dancing Goats", location: {lat: 33.7811075, lng: -84.3867295}},
];

	var largeInfoWindow = new google.maps.InfoWindow();

	// iterate over list and make marker for each place
	for (var i=0; i < places.length; i++){
		var position = places[i].location;
		var title = places[i].name;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: 1
		});

		markers.push(marker);

		//add click even for infowindow
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		})

		// add infowindow
		var infowindow = new google.maps.InfoWindow({
			content: title
		});
	}

// function to add content to infowindow
function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);

		infowindow.addListener('closeclick', function(){
			infowindow.setMarker = null;
		});
	}
}



};


/*
ko.applyBindings(places);*/