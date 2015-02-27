

function gpDataString(surgery){

    string =    "<div>"
                +"<h1>" + surgery.name + "</h1>"
                + "<br/><br/>"
                +  "<p>KEY FACTS" + "</p>"
                +  "<p>Registered Patients: "
                    + Math.round(surgery.registered_patients) + "</p>"
                + "<p>User Rating: "
                    +  surgery.nhs_choices_user_rating + "</p>"
                + "<br/><br/>"

    aAddress = surgery.address.split('\n')
    for(i = 0; i < aAddress.length; i++){
        string += "<p>&nbsp;&nbsp"
                    + aAddress[i] + "</p>"
    }

    string += "<br/><br/><p>attribution: NHS Choices</p></div>";

    return string;
}

var infowindow = new google.maps.InfoWindow({maxWidth: 400})

function createMarker(surgery, loc, name, id){ // create a marker with a info window

    var marker = new google.maps.Marker({position: loc,
                                        title: name,
                                        icon: "/images/medical96.png"
                                        });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close();
        infowindow.setOptions({maxWidth: 400});
        infowindow.setContent(gpDataString(surgery));
        infowindow.open(map, marker);
        //$("#mapContainer").append("<div id='infoCanvas'></div>")
        //$("#header2").html(surgery.name);
        //string = gpDataString(surgery);
        //$("#dataBox").empty();
        //$("#dataBox").append(string);
    });
    return marker;
}


function hideMarkers(){
    for (i = 0; i < markers.length; i++){ //remove old markers
        markers[i].setMap(null);
        markers[i] = null;
    }
    markers = [];
    markerCluster.clearMarkers();
}


function showMarkers(){
    markers = addGPMarkers(markers)
    var mcOptions = {gridSize: 30, maxZoom: 14};
    markerCluster = new MarkerClusterer(map, markers, mcOptions);
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

function addGPMarkers(markers){

    for (var i = 0; i < oGPsData.surgeries.length; i++){
        var surgery = oGPsData.surgeries[i];
        if (surgery.geoStatus == "OK"){
            var name = surgery.name;
            var loc = getLoc(surgery);
            var id = surgery.id;
            markers.push(createMarker(surgery, loc, name, id));
        }
    };
    return markers
}

//function addMarkersToMap(markers) {
//    for (i = 0; i < markers.length; i++) { //add markers to map
//        markers[i].setMap(map);
//    }
//}

//
//function doMarkers(markers, loc_Center){
//    console.log("do markers")
//    console.log(markers)
//    markers = removeOldMarkers(markers)
//    markers = addGPMarkers(loc_Center, markers);
//    addMarkersToMap(markers)
//    return markers
//}


function findAddress() {
    var geocoder = new google.maps.Geocoder();
    var address = $('#address').val();
    console.log(address)
    geocoder.geocode( {'address': address + ', hampshire, uk'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var loc_Center = results[0].geometry.location;
            map.setCenter(loc_Center);
            map.setZoom(13);
            zoomChanged();
        } else {
            alert('We could not find your address for the following reason: ' + status);
        }
    });
}