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
];

// make list of places
var places = [
    {name: "Arts Center Station", location: {lat: 33.789304, lng: -84.3891965}, type: "metro"},
    {name: "DaVinci's Pizza", location: {lat: 33.788992, lng: -84.3886788}, type: "pizza"},
    {name: "Octane", location: {lat:33.7794023, lng: -84.4124513}, type: "coffee"},
    {name: "Foxtrot", location: {lat: 33.7857445, lng: -84.38633}, type: "cocktails/snacks"},
    {name: "Eleventh Street Pub", location: {lat: 33.7837559, lng: -84.3866712}, type: "dive bar"},
    {name: "Dancing Goats", location: {lat: 33.7811075, lng: -84.3867295}, type: "coffee"},
    {name: "Antico", location: {lat: 33.784625, lng: -84.405546}, type: "pizza"},
    {name: "Park Tavern", location: {lat:33.7822412, lng: -84.3713962}, type: "bar"},
    {name: "8ARM", location: {lat:33.773748, lng: -84.3661327}, type: "coffee"},
    {name: "Delia's Chicken Sausage Stand", location: {lat:33.7764379, lng: -84.4094803}, type: "food"}

];

var map;

// set up ko array for interacting with html
var markers = ko.observableArray();
var filteredOutput = ko.observableArray([]);


function initMap() {

	// make map and center it on Atlantic House
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15,
	  center: {lat: 33.7861132, lng: -84.3896419},
	  styles: styles
	});
    ko.applyBindings(new ViewModel());
}

function mapError() {
    document.getElementById('error').innerHTML = "<h1> ERROR LOADING PAGE! do you even have internet? Check, then reload.</h1>";
}

var ViewModel = function() {
    var self = this;

    //get user input in the search box
    self.searchBoxInput = ko.observable("");
    self.filteredList = ko.computed(function() {
        var filter = self.searchBoxInput().toLowerCase();
        if (!filter){
            return places
        } else {
            var listy = [];
            places.forEach(function(placeItem){
                if (placeItem.name.indexOf(self.searchBoxInput().toLowerCase()) !== -1){
                    listy.push(placeItem);
                }
            })
            return listy
        }
    });

	var largeInfoWindow = new google.maps.InfoWindow();

    //bounds handler
    var bounds = new google.maps.LatLngBounds();

	// iterate over list and make marker for each place
	for (let i=0; i < places.length; i++){
		var position = places[i].location;
		var title = places[i].name;
		var type = places[i].type;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i,
			type: type,
            opacity: 0.5
		});
        //extend the bounds for each marker
        bounds.extend(position);

		markers.push(marker);

    //add click event for marker
    marker.addListener('click', clickMarker);

	// make marker change color on mouseover
	marker.addListener('mouseover', mouseOverMarker);

	// make marker go back to normal on mouse out
	marker.addListener('mouseout', mouseOutMarker);
	}

    //fit the map to the bounds
    map.fitBounds(bounds);

/*	var placeSearchBox = document.getElementById('placeSearchBox');
	var options = {
		types: ['establishment'],
        bounds: bounds
	};

	autocomplete = new google.maps.places.Autocomplete(placeSearchBox, options);*/

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


// function to drop a pin from heaven
function bouncePin(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){marker.setAnimation(null); }, 750);
	}
}


function clickMarker() {
    populateInfoWindow(this,largeInfoWindow);
    bouncePin(this);
}

function mouseOverMarker() {
    this.setOpacity(1.0);
}

function mouseOutMarker() {
    this.setOpacity(0.5);
}



/*$('#placeSearchBox').on('input', function() {
    var userInput = $(this).val();
    console.log(userInput);
})*/


};

