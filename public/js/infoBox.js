var markers = []


function createMarker(surgery, loc, name, id){ // create a marker with a info window
    var marker = new google.maps.Marker({position: loc, title: name});
    google.maps.event.addListener(marker, 'click', function () {
        //$("#header2").html(name)
        console.log("here")
    });


    return marker;
}

function removeOldMarkers(){
    if(markers[0] != null){
        for (i = 0; i < markers.length; i++){ //remove old markers
            markers[i].setMap(null);
            markers[i] = null;
        }
        markers = [null]
    };
}


function addSearchMarker(loc_Center, name){
    var marker = new google.maps.Marker({position: loc_Center, title: name});
    google.maps.event.addListener(marker, 'click', function () {
        var infowindow = new google.maps.InfoWindow({content: name
                                                    , maxWidth: 200
                                                    })
        infowindow.open(map, marker);
    })
    return marker
}

function getLoc(surgery){ //extracts google location from surgery object
    return new google.maps.LatLng(surgery.geoCode.lat, surgery.geoCode.lng);
};

function addGPMarkers(loc_Center){
    for (var i = 0; i < oGPsData.surgeries.length; i++){
        var surgery = oGPsData.surgeries[i];
        if (surgery.geoStatus == "OK"){
            var name = surgery.name
            var loc = getLoc(surgery);
            var id = surgery.id
            var distance = google.maps.geometry.spherical.computeDistanceBetween (loc_Center, loc);
            if (distance <5000){
                markers.push(createMarker(surgery, loc, name, id));

            };
        }
    };
    return markers
}

function addMarkersToMap(markers) {
    console.log(markers)
    for (i = 0; i < markers.length; i++) { //add markers to map
        markers[i].setMap(map);
    }
}


function findAddress() {

    var geocoder = new google.maps.Geocoder();
    var address = $('#address').val();
    console.log(address)
    geocoder.geocode( {'address': address + ', hampshire, uk'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            removeOldMarkers()

            var loc_Center = results[0].geometry.location;
            map.setCenter(loc_Center);
            map.setZoom(13);
        } else {
            alert('We could not find your address for the following reason: ' + status);
        }

        markers[0] = addSearchMarker(loc_Center, address);
        markers = addGPMarkers(loc_Center, markers);
        addMarkersToMap(markers)

    });




}