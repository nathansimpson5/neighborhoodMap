function initMap() {
	var midtown = {lat: 33.7861132, lng: -84.3896419};

	//make map and center it on Atlantic House
	var map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15,
	  center: midtown
	});

	// Create market for midtown
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





}