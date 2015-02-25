var markers = []

function gpDataString(surgery){

    string = "<br/><br/>"
                +  "<p class='gpDataText'>KEY FACTS" + "</p>"
                +  "<p class='gpDataText'>Registered Patients: "
                    + Math.round(surgery.registered_patients) + "</p>"
                + "<p class='gpDataText'>User Rating: "
                    +  surgery.nhs_choices_user_rating + "</p>"
                + "<br/><br/>"

    aAddress = surgery.address.split('\n')
    for(i = 0; i < aAddress.length; i++){
        string += "<p class='gpDataText'>&nbsp;&nbsp"
                    + aAddress[i] + "</p>"
    }

    string += "<p class='gpSrcText '>data source: NHS Choices</p>";

    return string;
}


function createMarker(surgery, loc, name, id){ // create a marker with a info window

    var marker = new google.maps.Marker({position: loc, title: name});
    google.maps.event.addListener(marker, 'click', function () {
        //$("#mapContainer").append("<div id='infoCanvas'></div>")
        //$("#header2").html(surgery.name);
        //string = gpDataString(surgery);
        //$("#dataBox").empty();
        //$("#dataBox").append(string);
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
    for (i = 1; i < markers.length; i++) { //add markers to map
        markers[i].setMap(map);
    }
}


function doMarkers(loc_Center){
    removeOldMarkers()
    markers = addGPMarkers(loc_Center, markers);
    addMarkersToMap(markers)
}


function findAddress() {

    $("#header2").html("Hampshire County");
    $("#dataBox").empty();
    $("#dataBox").append("<br/><p class='gpDataText'>click on GP surgery marker for details...</p>")


    var geocoder = new google.maps.Geocoder();
    var address = $('#address').val();
    console.log(address)
    geocoder.geocode( {'address': address + ', hampshire, uk'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var loc_Center = results[0].geometry.location;
            console.log(loc_Center)
            doMarkers(loc_Center);
            map.setCenter(loc_Center);
            map.setZoom(13);
            zoomChanged();
        } else {
            alert('We could not find your address for the following reason: ' + status);
        }

        //markers[0] = addSearchMarker(loc_Center, address);


    });




}