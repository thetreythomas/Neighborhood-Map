// My Markers
var myMarkers = [
    {
        name: "K1 Speed",
        lat: 30.384619,
        lng: -97.720848,
        street: "2500 McHale Ct.",
        city: "Austin, TX 78758",
        //phone: "(512) 271-5475",
        //url: "https://www.k1speed.com/austin-location.html"
    },
    {
        name: "Topgolf",
        lat: 30.398064,
        lng: -97.717714,
        street: "2700 Esperanza Crossing",
        city: "Austin, TX 78758",
        //phone: "(512) 222-5950",
        //url: "http://http://topgolf.com/us/austin/"
    },
    {
        name: "Alamo Drafthouse - Village",
        lat: 30.360031,
        lng: -97.734853,
        street: "2700 W Anderson Ln",
        city: "Austin, TX 78757",
        //phone: "(512) 861-7030",
        //url: "https://drafthouse.com/theater/village"
    },
    {
        name: "The Common Interest - Karaoke Bar & Grill",
        lat: 30.366242,
        lng: -97.729238,
        street: "8400 Burnet Rd",
        city: "Austin, TX 78757",
        //phone: "(512) 453-6796",
        //url: "http://www.ciaustin.com/"
    },
    {
        name: "Punch Bowl Social Austin",
        lat: 30.3999985,
        lng: -97.725531,
        street: "11310 Domain Dr.",
        city: "Austin, TX 78758",
        //phone: "(512) 368-9070",
        //url: "http://www.punchbowlsocial.com/home"
    },
    {
        name: "Fry's Electronics",
        lat: 30.422928,
        lng: -97.700197,
        street: "12707 N Mopac Expy",
        city: "Austin, TX 78727",
        //phone: "(512) 733-7000",
        //url: "http://www.frys.com/ac/storeinfo/austin-location-frys-electronics-hours-maps-directions"
    },
    {
        name: "Opal Divine's Marina",
        lat: 30.423585,
        lng: -97.702114,
        street: "12709 N Mopac Expy",
        city: "Austin, TX 78727",
        //phone: "(512) 733-5353",
        //url: "http://www.opaldivines.com/"
    },
    {
        name: "Walnut Creek Metroploitian Park",
        lat: 30.401127,
        lng: -97.685960,
        street: "12138 N Lamar Blvd",
        city: "AUstin, TX 78753",
        //phone: "(512) 974-6700",
        //url: "http://www.austintexas.gov/page/park-directory#w"
    }
];


// Model
// Location Constructor Function
var Location = function(data) {
    var self = this;

    self.name = ko.observable(data.name);
    self.lat = ko.observable(data.lat);
    self.lng = ko.observable(data.lng);
    self.street = ko.observable(data.street);
    self.city = ko.observable(data.city);
    self.phone = ko.observable(); // Will be retrieved from Foursquare API
    self.url = ko.observable();  // Will be retrieved from Foursquare API
    self.show = ko.observable(true);


    // Foursquare API Information
    var clientID = "D2GUCKJP4VMFZBHN3ZAL3WX2LNFDLARDD4HS5FG3IAJBRV4B";
    var clientSecret = "2JUH3GZ3D1XDCG5R0WK5BPZHYAKYLNUCGXP4DY2ZOJWIIWO0";

    // Foursquare API Call
    // https://developer.foursquare.com/docs/venues/search
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ self.lat() +
    ',' + self.lng() + '&client_id=' + clientID + '&client_secret=' + clientSecret +
    '&v=20160118' + '&query=' + self.name();

    // .getJSON from each searched location
    // http://api.jquery.com/jquery.getjson/
    $.getJSON(foursquareURL, function(data) {
        var result = data.response.venues[0];

        self.url(result.url);
        if (typeof self.url() === 'undefined') {
            self.url("");
        }
        self.phone(result.contact.formattedPhone);
    }).fail(function (){
        alert("Danger, Will Robinson! Danger!");
    });

    // Google Maps API info window information
    // https://developers.google.com/maps/documentation/javascript/infowindows
    this.contentString = ko.computed(function() {
        return  '<div><b>' + self.name() + '</b></div>' +
                '<div>'+ self.street() + '</div>' +
                '<div>'+ self.phone() + '</div>' +
                '<div><a href="' + self.url() + '">' + self.url() + '</a></div>';
    });

    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString()
    });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lat(), self.lng()),
        map: map,
        title: self.name()
    });

    this.marker.setMap(map);

    this.marker.addListener('click', function() {
        self.infoWindow.setContent(self.contentString());
        self.infoWindow.open(map, this);

        // https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        //http://www.w3schools.com/js/js_timing.asp
        // 700 milliseconds is one full bounce
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 1400);
    });

    this.animateClick = function(singleListItem) {
        google.maps.event.trigger(self.marker, 'click');
    };

}; // End of Location Constructor Function


// ViewModel

function ViewModel () {
    var self = this;

    this.markerList = ko.observableArray();

    myMarkers.forEach(function(e){
        self.markerList.push(new Location(e));
    });

    // Creating a filtered list
    // Kudos to the information found here
    // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html

    this.searchText = ko.observable("");

    this.filteredList = ko.computed(function() {
        var filter = self.searchText().toLowerCase();
        if (self.searchText() === null) {
            return self.markerList();
        } else {
            return ko.utils.arrayFilter(self.markerList(), function(markerItem) {
                if(markerItem.name().toLowerCase().indexOf(filter) >= 0) {
                    markerItem.show(true);
                    markerItem.marker.setVisible(true);
                    return true;
                } else {
                    markerItem.show(false);
                    markerItem.marker.setVisible(false);
                    return false;
                }
            });
        }
    }, self);

}

function initMap() {
    var self = this;

    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 30.390335, lng: -97.703289},
        zoom: 13
    });

    ko.applyBindings(new ViewModel());
};

// Google Maps Error Handling
//https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282#checking-fallback-technique

function googleError() {
    alert("Google Maps has failed to load for some reason or another. It is not your fault. Grab a beer.")
}