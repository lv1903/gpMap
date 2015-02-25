var geocoder;
var map;
var polygons = {};
var aYears = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"]
var maxVisits = 1.5;
var minVisits = 0.5;


//var aKeyValues = ["           NA", "    < 100%", "100-105%", "105-110%", "110-120%", "120-130%", "130-150%", "    > 150%"]

function setYearOptions(){
    $.each(aYears, function (i) {
        $('#yearList').append(new Option(aYears[i]))
    });
    $("#yearList").val(year)
}


//function setKeyColors(){
//    var oKeyColors = {};
//    oKeyColors["color0"] = "hsla(60, 16%, 50%, 1)";
//    oKeyColors["color1"] = "hsla(120, 100%, 70%, 1)";
//    var hue = 60;
//    var hueMin = 0;
//    var hueStep = (hue - hueMin) /  (aKeyValues.length - 3);
//    var lightness = 70;
//    var lightnessMin = 50;
//    var lightnessStep = (lightness - lightnessMin) /  (aKeyValues.length - 3);
//    for(i = 2; i < aKeyValues.length; i++){
//        name = "color" + i;
//        value = "hsla(" + hue + " ,100%, " + lightness + "%, 1)";
//        oKeyColors[name] = value
//        hue -= hueStep;
//        lightness -=lightnessStep;
//    }
//    return oKeyColors
//}
//
//function selectKeyColor(n){
//    if (isNaN(n)){return oKeyColors["color0"]};
//    if(n < 1){return oKeyColors["color1"]};
//    if(n < 1.05 && n >= 1){return oKeyColors["color2"]};
//    if(n < 1.1 && n >= 1.05){return oKeyColors["color3"]};
//    if(n < 1.2 && n >= 1.1){return oKeyColors["color4"]};
//    if(n < 1.3 && n >= 1.2){return oKeyColors["color5"]};
//    if(n < 1.5 && n >= 1.4){return oKeyColors["color6"]}
//    if(n >= 1.5){return oKeyColors["color7"]};
//}
//
//function addKey() {
//    var c = document.getElementById('mapKey');
//
//    var ctx = c.getContext("2d");
//
//    var boxH = 30;
//    var boxW = 105;
//
//    ctx.fillStyle = "white";
//    for (i = 0; i < aKeyValues.length; i++) {
//        ctx.fillRect(0, (i * (10 + boxH)), boxW, boxH);
//    }
//
//    ctx.font = "bold 15px  Arial";
//    ctx.fillStyle = "black";
//    for (i = 0; i < aKeyValues.length; i++) {
//        var title = aKeyValues[aKeyValues.length - i - 1];
//        ctx.fillText(title, 5, 20 + (i * (10 + boxH)));
//    }
//
//    for (i = 0; i < aKeyValues.length; i++) {
//        var number = aKeyValues.length - i - 1
//        var name = "color" + number
//        ctx.fillStyle = oKeyColors[name];
//        ctx.fillRect(80, (i * (10 + boxH)) + 5, boxH - 10, boxH - 10);
//    }
//}

function loadGeoData(){
    map.data.addGeoJson(oGeoData)
}

function zoomChanged(){
    var zoomLevel = map.getZoom();
    var sMapType;
    if(zoomLevel > 9) {
        map.setMapTypeId('local');
    } else {
        map.setMapTypeId('county');
    }
}

function initialize() {

    var latlng = new google.maps.LatLng(51.0, -1.2);
    var mapOptions = {
        zoom: 9,
        center: latlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        }
    };

    //map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
    map = new google.maps.Map($(".mapCanvas")[0], mapOptions);

    var styledMapOptions = {map: map, name: 'county'};
    var styledMapOptionsLocal = {map: map, name: 'local'};

    var sMapType = new google.maps.StyledMapType(mapStyles,styledMapOptions);
    map.mapTypes.set('county', sMapType);
    map.setMapTypeId('county');

    var sMapTypeLocal = new google.maps.StyledMapType(mapStylesLocal,styledMapOptionsLocal);
    map.mapTypes.set('local', sMapTypeLocal);

    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomChanged()
    });

    loadGeoData()
    setYearOptions()
    polygonColors(year)
    addKeyD3()
}

var oKeyColors = setKeyColors()
google.maps.event.addDomListener(window, 'load', initialize);