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
    {name: "Arts Center Station", location: {lat: 33.789382369669426, lng: -84.38720934744636}, type: "metro", id: "49e8940ef964a52054651fe3"},
    {name: "Octane", location: {lat:33.77932568445548, lng: -84.41016912460327}, type: "coffee", id: "4144e300f964a520ad1c1fe3"},
    {name: "Foxtrot", location: {lat: 33.78556045322771, lng: -84.38606100383434}, type: "cocktails/snacks", id: "57f85f7e498e8ced1a49efc6"},
    {name: "Dancing Goats", location: {lat: 33.78082391296792, lng: -84.38665351188497}, type: "coffee", id: "588e77fc5e7896466a8dc683"},
    {name: "Antico", location: {lat: 33.784642447338825, lng: -84.40579907362273}, type: "pizza", id: "4ac29836f964a520e79920e3"},
    {name: "Park Tavern", location: {lat:33.78232196216649, lng: -84.36946392059326}, type: "bar", id: "40e0b100f964a52023071fe3"},
    {name: "8ARM", location: {lat:33.77387236840846, lng: -84.36405926942825}, type: "coffee", id: "57b8cfa7498efd6377057e33"},
    {name: "Delia's Chicken Sausage Stand", location: {lat:33.77640638325673, lng: -84.4074081625613}, type: "food", id: "53b4302f498eccff0c78b9ab"}

];

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
            showMarkers(markers());
            return markers();
        } else {
            var listy = [];
            hideMarkers(markers());
            markers().forEach(function(placeItem){
                if (placeItem.title.toLowerCase().indexOf(self.searchBoxInput()) !== -1){
                    listy.push(placeItem);
                    showMarkers(listy);
                }
            });
            return listy;
        }
    });

	var infoWindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });

    //bounds handler
    var bounds = new google.maps.LatLngBounds();

	// iterate over list and make marker for each place
	for (let i=0; i < places.length; i++){
		var position = places[i].location;
		var title = places[i].name;
		var type = places[i].type;
        var id = places[i].id;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: id,
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

var result;

// function to add content to infowindow
function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;

        //foursquare API authentication
        var foursquareClientId = "JR52CKCFQ4ZOI1OHAHBMW5JHWFXJFXA0CUBO0ZFTYN11YGHV";
        var foursquareClientSecret = "NAA0XP2JH2CMHWAUUTRZWKVUEYSVKCXW2PMFCAC0L5DDXHGG";
        var foursquareVenueId = marker.id;


        //foursquare venue search call
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/"+ foursquareVenueId + '/tips?',
            method: 'GET',
            async: true,
            dataType: "json",
            data: {
                client_id: foursquareClientId,
                client_secret: foursquareClientSecret,
                v: "20170801",
                venue_id: foursquareVenueId,
                limit: 5,
                sort: 'popular'        
            },
            success: function(stuff) {
                result = stuff.response.tips.items[0].text;
                infowindow.setContent('<div>' + marker.title + ' | ' + marker.type + '</div><hr><div>'+result+'</div>');

                infowindow.open(map, marker);
                infowindow.addListener('closeclick', function(){
                    infowindow.setMarker = null;
                });
            },
            error: function(err){
                infowindow.setContent('<div>Foursquare data is unavailable. Please try refreshing.</div>');

                infowindow.open(map,marker);
            }
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
    populateInfoWindow(this,infoWindow);
    bouncePin(this);
    map.setCenter(this.getPosition());
}

function mouseOverMarker() {
    this.setOpacity(1.0);
}

function mouseOutMarker() {
    this.setOpacity(0.5);
}

function hideMarkers(list) {
    list.forEach(function(marker) {
        marker.setVisible(false);
    })
}

function showMarkers(list){
    list.forEach(function(marker) {
        marker.setVisible(true);
    })
}



};

