// TODO: make list of places
// TODO: iterate over knockout array to add items on left
// TODO: add info to infowindow



function initMap() {
	var midtown = {lat: 33.7861132, lng: -84.3896419};

	//make map and center it on Atlantic House
	var map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15,
	  center: midtown
	});

	// Create marker for midtown
	var marker = new google.maps.Marker({
	  position: midtown,
	  map: map
	});

	// Click handler to make infowindow appear
	marker.addListener('click', function() {
		infowindow.open(map,marker);
	});

	// Add infowindow
	var infowindow = new google.maps.InfoWindow({
		content: "Nathan House"
	});



};

//knockoutJS stuff
var places = ko.observableArray([
	{name: "Nathan", age: 28},
	{name: "snake", age: 18}
]);

ko.applyBindings(places);