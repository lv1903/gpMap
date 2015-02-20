function findYearIndex(){
    var i = 0;
    while($("#yearList").val() != aYears[i]){
        i++;
    }
    return i
}


function setButtonColors(year){
    var i = findYearIndex()
    $("#backButton").css("color", "black");
    $("#forwardButton").css("color", "black");
    if( i == aYears.length - 1) {
        $("#forwardButton").css("color", "lightgrey");
    }
    if( i == 0) {
        $("#backButton").css("color", "lightgrey");
    }
}


function polygonColors(year){

    if(!(oPressureData.hasOwnProperty(year))) {
        $.ajax("/" + year).done(function (oPressureDataYear) {
            oPressureData[year] = oPressureDataYear;
        });
    };

    map.data.setStyle(function(feature) {
        var id = feature.getProperty('LSOA01CD');
        if(typeof id != "string"){
            var id = feature.getProperty('LSOA11CD');
        }
        if (!oPressureData[year].hasOwnProperty(id)) {
            return {
                fillColor: selectKeyColor("NA"),
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        } else {
            var n = oPressureData[year][id];
            var color = selectKeyColor(n);
            return {
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        }
    })
}


$(function () { //change year from list
    $("#yearList").change(function () {
        var year = $("#yearList").val();
        setButtonColors(year);
        polygonColors(year);
    });
});


$(function () {
    $("#forwardButton").click(function(){ //change from forward button
        var i = findYearIndex()
        if( i == aYears.length - 1) {
            var year = aYears[i]
        }else {
            var year = aYears[i + 1];
            $("#yearList").val(year);
        }
        setButtonColors(year)
        polygonColors(year)
    })
})


$(function () { // change from back button
    $("#backButton").click(function(){
        var i = findYearIndex()
        if( i == 0) {
            var year = aYears[0]
        }else {
            var year = aYears[i - 1];
            $("#yearList").val(year);
        }
        setButtonColors(year)
        polygonColors(year)
    })
})


$(function() { //search address
    $("#findButton").click(function(){
        findAddress(address);
    })

})


