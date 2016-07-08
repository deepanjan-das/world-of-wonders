$(document).ready(function () {
    getPlacesData();

    function getPlacesData()
    {
        $.get('../project/data/WHS_list.txt', function (data) {
            var eachLine = data.split('\n');
            var placeData = new Array;
            var tag = "";
            for (i = 0; i < eachLine.length; i++) {
                var cell = eachLine[i].split('|');
                placeData[i] = {
                    'Name': cell[0],
                    'Location': cell[1],
                    'Latitude': parseFloat(cell[2]),
                    'Longitude': parseFloat(cell[3]),
                    'Tags': cell[4],
                    'WikiSearchTitle': cell[5],
                    'FiveHundredSearchTag': cell[6]
                }

            }
            tag = getPlaceNameFromQueryString();
            for (i = 0; i < placeData.length; i++) {
                if (tag == placeData[i].FiveHundredSearchTag) {
                    console.log("matched tag placeData[i]: ", placeData[i]);
                    loadPhotos(placeData[i]);
                    break;
                }

            }
        });
    }


    //this function doesnt need placeData
    function getPlaceNameFromQueryString() {
        var flag = "false";
        var qString = "";
        var pageUrl = document.URL;
        console.log("pageUrl: ", pageUrl);
        var vars = [], hash;
        var q = pageUrl.split('?')[1];
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++)
            {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars['tag'];
    }

    function loadPhotos(place)
    {
        
        var fiveHundredPxKey = "UCtNbOxkcWYA6q66QmpMGPL4sUQ8oCgO5kkDkGMA";
        var fiveHundredPxTag = place.FiveHundredSearchTag;
        var rppTen = "10";
        var imageSize = "5";
        var fiveHundredPxTagMethod = "https://api.500px.com/v1/photos/search?consumer_key=";
        var fiveHundredPxTagPhotoURL = fiveHundredPxTagMethod + fiveHundredPxKey + "&tag=" + fiveHundredPxTag + "&sort=favorites_count&page=1&rpp=" + rppTen + "&image_size=" + imageSize;
        $.ajax({
            url: fiveHundredPxTagPhotoURL,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                successFunction(data);
            },
            error: function (xhr, status, er) { alert("Error ocurred in AJAX call to 500px API: ", xhr.status); }
        });

        function successFunction(data) {
            var photoUrl = new Array();
            var photoUrlDiv = "";
            var imgId = new String;
            var imgIdMobile = new String;
            var pTitleDiv;
            var pNameDiv;
            var url;
            //
            var photoTitleID = new String;
            var photogID = new String;
            var photog = new Array();
            var title = new Array();

            imgId = "";

            $.each(data.photos, function (i, item) {
                url = item.image_url;
                photoUrl.push(url);
                title.push(item.name);
                photog.push(item.user.fullname);
            });
            for (var j = 0; j < photoUrl.length; j++) {
                var jString = j.toString();
                photoTitleID = "#photoTitle" + jString;
                photogID = "#photogName" + jString;
                $(photoTitleID).text("");
                $(photogID).text("");
                imgId = "#photo" + jString;
                imgIdMobile = "#Img" + jString;
                pTitleDiv = "#pTitle" + jString;
                pNameDiv = "#pName" + jString;
                //insert photo url's into 'src' attribute of img tags with id = photo0, photo1, etc.
                $(imgId).attr('src', photoUrl[j]);
                $(imgIdMobile).attr('src', photoUrl[j]);
                $(photoTitleID).text(title[j]);
                $(photogID).text("by " + photog[j]);
                $(pTitleDiv).text(title[j]);
                $(pNameDiv).text("by " + photog[j]);
                console.log("title array: ", title[j]);
                console.log("photog array: ", photog[j]);

            }
        }
    }
});