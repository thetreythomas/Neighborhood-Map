// My Markers
var myMarkers = [
    {
        name: "K1 Speed",
        lat: 30.384619,
        lng: -97.720848,
        street: "2500 McHale Ct.",
        city: "Austin, TX 78758",
        //phone: "(512) 271-5475",
        url: "https://www.k1speed.com/austin-location.html"
    },
    {
        name: "Topgolf",
        lat: 30.398064,
        lng: -97.717714,
        street: "2700 Esperanza Crossing",
        city: "Austin, TX 78758",
        //phone: "(512) 222-5950",
        url: "http://http://topgolf.com/us/austin/"
    },
    {
        name: "Alamo Drafthouse - Village",
        lat: 30.360031,
        lng: -97.734853,
        street: "2700 W Anderson Ln",
        city: "Austin, TX 78757",
        //phone: "(512) 861-7030",
        url: "https://drafthouse.com/theater/village"
    },
    {
        name: "The Common Interest - Karaoke Bar & Grill",
        lat: 30.366242,
        lng: -97.729238,
        street: "8400 Burnet Rd",
        city: "Austin, TX 78757",
        //phone: "(512) 453-6796",
        url: "http://www.ciaustin.com/"
    },
    {
        name: "Punch Bowl Social Austin",
        lat: 30.3999985,
        lng: -97.725531,
        street: "11310 Domain Dr.",
        city: "Austin, TX 78758",
        //phone: "(512) 368-9070",
        url: "http://www.punchbowlsocial.com/home"
    },
    {
        name: "Fry's Electronics",
        lat: 30.422928,
        lng: -97.700197,
        street: "12707 N Mopac Expy",
        city: "Austin, TX 78727",
        //phone: "(512) 733-7000",
        url: "http://www.frys.com/ac/storeinfo/austin-location-frys-electronics-hours-maps-directions"
    },
    {
        name: "Opal Divine's Marina",
        lat: 30.423585,
        lng: -97.702114,
        street: "12709 N Mopac Expy",
        city: "Austin, TX 78727",
        //phone: "(512) 733-5353",
        url: "http://www.opaldivines.com/"
    },
    {
        name: "Walnut Creek Metroploitian Park",
        lat: 30.401127,
        lng: -97.685960,
        street: "12138 N Lamar Blvd",
        city: "AUstin, TX 78753",
        //phone: "(512) 974-6700",
        url: "http://www.austintexas.gov/page/park-directory#w"
    }
];


// Model
// Location Constructor Function
var Location = function(data) {
    var self = this;

    console.log("Location "+data.name+" set");
    this.name = ko.observable(data.name);
        console.log(this.name());
    this.lat = ko.observable(data.lat);
        console.log(this.lat());
    this.lng = ko.observable(data.lng);
        console.log(this.lng());
    this.street = ko.observable(data.street);
        console.log(this.street());
    this.city = ko.observable(data.city);
        console.log(this.city());
    this.phone = ko.observable(""); // Will be retrieved from Foursquare API
        console.log(this.phone());
    this.url = ko.observable("");  // Will be retrieved from Foursquare API
        console.log(this.url());
    this.show = ko.observable(true);
        console.log(this.show());
    //Items added from Foursquare API
    // this.url = '';
    //this.facebookName = ko.observable('');
    //this.categoryName = ko.observable('');

    // Foursquare API Information
    var clientID = "D2GUCKJP4VMFZBHN3ZAL3WX2LNFDLARDD4HS5FG3IAJBRV4B";
    var clientSecret = "2JUH3GZ3D1XDCG5R0WK5BPZHYAKYLNUCGXP4DY2ZOJWIIWO0";

    // Foursquare API Call
    // https://developer.foursquare.com/docs/venues/search
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat() +
    ',' + this.lng() + '&client_id=' + clientID + '&client_secret=' + clientSecret +
    '&v=20160118' + '&query=' + this.name();
    console.log(foursquareURL);

    // .getJSON from each searched location
    // http://api.jquery.com/jquery.getjson/
    $.getJSON(foursquareURL, function(data) {
        //console.log(data.repsonse.venues[0]);

        var result = data.response.venues[0];

        if (typeof self.url === 'undefined') {
            self.url("");
        } else {
            self.url(result.url);
        }

        console.log(self.url() + " This is the URL from Foursquare API");
        self.phone(result.contact.formattedPhone);
        console.log(self.phone() + " This is the formatted phone number from Foursquare API");

        // that.facebookName(result.contact.facebookUsername);
        // console.log(that.facebookName() + " This is the Facebook Name from Foursquare API")
        // that.categoryName(result.categories.name);
        // console.log(that.categoryName() + " This is the Category type from Foursquare API");

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
    });
}; // End of Location Constructor Function


// ViewModel

function ViewModel () {
console.log("ViewModel Start");

    var self = this;

    this.markerList = ko.observableArray();

    myMarkers.forEach(function(e){
        console.log('Starting the creation of '+ e.name);
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
                    return true;
                } else {
                    markerItem.show(false);
                    return false;
                }
            });
        }
    }, self);

}

function initMap() {
    var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.2672, lng: -97.7431},
        zoom: 12
    });

    ko.applyBindings(new ViewModel());
};











