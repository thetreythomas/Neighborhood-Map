// Model

// Google Map and Markers
var map;
var myLatLong = {lat: 30.2672, lng: -97.7431};

// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//       center: myLatLong,
//       zoom: 12
//     });

//     var marker = new google.maps.Marker({
//         map: map,
//         position: myLatLong,
//         animation: google.maps.Animation.DROP,
//         title: "This is Austin, y'all!"
//     });

//     var infowindow = new google.maps.InfoWindow({
//         content: '<p>Marker Location:' + marker.getPosition() + '</p>'
//     });

//     google.maps.event.addListener(marker, 'click', function() {
//         infowindow.open(map, marker);
//     });
// }


// My Markers
var myMarkers = [
    {
        title: "K1 Speed",
        lat: 30.384619,
        lng: -97.720848,
        street: "2500 McHale Ct.",
        city: "Austin, TX 78758",
        phone: "(512) 271-5475",
        url: "https://www.k1speed.com/austin-location.html"
    },
    {
        title: "Topgolf",
        lat: 30.398064,
        lng: -97.717714,
        street: "2700 Esperanza Crossing",
        city: "Austin, TX 78758",
        phone: "(512) 222-5950",
        url: "http://http://topgolf.com/us/austin/"
    },
    {
        title: "Alamo Drafthouse - Village",
        lat: 30.360031,
        lng: -97.734853,
        street: "2700 W Anderson Ln",
        city: "Austin, TX 78757",
        phone: "(512) 861-7030",
        url: "https://drafthouse.com/theater/village"
    },
    {
        title: "The Common Interest - Karaoke Bar & Grill",
        lat: 30.366242,
        lng: -97.729238,
        street: "8400 Burnet Rd",
        city: "Austin, TX 78757",
        phone: "(512) 453-6796",
        url: "http://www.ciaustin.com/"
    },
    {
        title: "GT Distributors - Gun Store",
        lat: 30.391606,
        lng: -97.719653,
        street: "2545 Brockton Dr. #100",
        city: "Austin, TX 78758",
        phone: "(512) 451-8298",
        url: "https://www.gtdist.com/"
    },
    {
        title: "Fry's Electronics",
        lat: 30.422928,
        lng: -97.700197,
        street: "12707 N Mopac Expy",
        city: "Austin, TX 78727",
        phone: "(512) 733-7000",
        url: "http://www.frys.com/ac/storeinfo/austin-location-frys-electronics-hours-maps-directions"
    },
    {
        title: "Opal Divine's Marina",
        lat: 30.423585,
        lng: -97.702114,
        street: "12709 N Mopac Expy",
        city: "Austin, TX 78727",
        phone: "(512) 733-5353",
        url: "http://www.opaldivines.com/"
    },
    {
        title: "Walnut Creek Metroploitian Park",
        lat: 30.401127,
        lng: -97.685960,
        street: "12138 N Lamar Blvd",
        city: "AUstin, TX 78753",
        phone: "(512) 974-6700",
        url: "http://www.austintexas.gov/page/park-directory#w"
    }
];


var markerItem = function(data) {
    var self = this;

    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.street = data.street;
    this.city = data.city;
    this.phone = data.phone;
    this.url = data.url
    this.show = ko.observable(true);

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: data.title
    });

    this.displayMarker = ko.computed(function() {
        if(this.show() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);
};


// View

// Initialize the Markers on the Map

function viewModel() {
    var self = this;

    this.markersList = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLong,
        zoom: 12
    });

    var marker = new google.maps.Marker({
        map: map,
        position: myLatLong,
        animation: google.maps.Animation.DROP,
        title: "This is Austin, y'all!"
    });

    // myMarkers.forEach(function(marker) {
    //     self.markersList.push( new markerItem(marker));
    //     console.log(marker);
    // })

        myMarkers.forEach(function(locationItem){
        self.myMarkers.push( new markerItem(locationItem));
    });

};

ko.applyBindings(viewModel());







































