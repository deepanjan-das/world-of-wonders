    $(document).ready(function () {

    var wikiAPIURL = 'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=';
    
    var wikiSearchTitles = new Array;
    initialPageLoad();
    var mapObject = initiateGoogleMaps();
    plotWHSOnMap(mapObject);
    



    /*************FUNCTION DEFINITIONS***********/

    /*
    PURPOSE: Creates a Google Maps object centered at lat-long: 38.74, -101.64
             It displays the map object into the <div> tag in readtext.html file with ID = 'maps_section_1'
    PARAMS: NA
    RETURNS: Google Maps object
    */
    function initiateGoogleMaps() {
        var marker;
        var $mapArea = $("#mapAreaDiv");
        mapArea = $mapArea[0];
        mapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(38.74, -101.64)
        };

        map1 = new google.maps.Map(mapArea, mapOptions);

        return map1;
    }

    /*
    PURPOSE: invokes $.ajax() method to call Flickr API method to fetch single photo. The photo fetched is of small size.
    PARAMS:
        1. flickrUrlGeoTaggedPhotos: Flickr API url to fetch a photo with a particular geotag and tag
        2. placeData: The array that stores all information from text file WHS_USA.txt
        3. mapObject: Google Maps object returned by function initiateGoogleMaps()
        4. marker: Maps marker object created in function getFlickrPhotosAndMarkers(mapObject, placeData)
        5. i: loop counter variable in function getFlickrPhotosAndMarkers(mapObject, placeData) to iterate over each location
    RETURNS: NA
    */
    function flickrAjaxCall(flickrUrlGeoTaggedPhotos, placeData, mapObject, marker, i) {
        $.ajax({
            url: flickrUrlGeoTaggedPhotos,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                /*pURL stores the URL that is composed of details returned by the Flickr JSON object.
                It is the actual URL that points to the particular photo in the JSON object*/
                
                pURL = 'http://farm' + data.photos.photo[0].farm + '.static.flickr.com/' + data.photos.photo[0].server + '/' + data.photos.photo[0].id + '_' + data.photos.photo[0].secret + '_s.jpg';

                /*create infoWindow content string to be displayed inside infoWindow object*/
                var infoWindowContentString = '<div style="width: 150px;">'
                                            + '<b style="font-size:small;">' + placeData[i].Name + '</b>' /*the name of place*/
                                            + '<br />' +placeData[i].Location + '<br />' /*the location*/
                                            + '<img src="' + pURL + '" />';

                /*Set the infoWindow to pop up containing infoWindowContentString when user clicks on marker */
                var infoWindow1 = new google.maps.InfoWindow();

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        var latLng = marker.getPosition();
                        infoWindow1.close();
                        infoWindow1.setContent(infoWindowContentString);
                        infoWindow1.open(mapObject, marker);
                        ajaxCallWiki(placeData, i);
                        ajaxCall500px(placeData, i);
                        var latString = latLng.lat();
                        var lngString = latLng.lng();
                        var contentTitle = placeData[i].Name;
                        $("#contentTitle").text("");
                        $("#lat").text("");
                        $("#lng").text("");
                        $("#contentTitle").text(contentTitle);
                        $("#lat").text("Latitude: " + latString);
                        $("#lng").text("Longitude: " + lngString);
                        //enable for more info and more photos buttons
                        var ptag = placeData[i].FiveHundredSearchTag
                        var ptagUrl = "photopage.html?tag=" + ptag.toString();
                        $("#morePhotos").attr('href', ptagUrl);
                    }
                })(marker, i));
            },
            error: function (xhr, status, er) { alert("Error ocurred in AJAX call to Flickr API: ", xhr.status); }
        });
    }


    /*
    PURPOSE: 
        1. Prepares variables for Flickr AJAX call to its API
        2. Calls function flickrAjaxCall(flickrUrlGeoTaggedPhotos, placeData, mapObject, marker, i) to call Flickr API
    PARAMS: 
        1. mapObject: Google Maps object returned by function initiateGoogleMaps()
        2. placeData: The array that stores all information from text file WHS_USA.txt
    RETURNS: NA
    */
    function getFlickrPhotosAndMarkers(mapObject, placeData) {
        FLICKR_API_KEY = 'fe5d9dbc0f4b6f992c78f8583bce1d3c';
        FLICKR_METHOD = "flickr.photos.search";
        /*Set the markers on Maps from the given lat-lon in locations array*/
        for (var i = 0; i < placeData.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(placeData[i].Latitude, placeData[i].Longitude),
                map: mapObject
            });

            /*call Flickr API to fetch photos*/
            flickrUrlGeoTaggedPhotos = "http://api.flickr.com/services/rest/?"
                                + "&method=" + FLICKR_METHOD
                                + "&api_key=" + FLICKR_API_KEY
                                + "&tags=" + placeData[i].Tags
                                + "&lat=" + placeData[i].Latitude
                                + "&lon=" + placeData[i].Longitude
                                + "&per_page=1"
                                + "&format=json&jsoncallback=?";
            console.log("Flickr API url: ",flickrUrlGeoTaggedPhotos);
            /*function that performs an ajax call to Flickr API. Included parameters are required to generate 
            the infoWindow contents for each marker in the loop.*/
            flickrAjaxCall(flickrUrlGeoTaggedPhotos, placeData, mapObject, marker, i);

           
        }
    }


    /*
    PURPOSE: 
        1. Get location details from text file WHS_USA.txt and store it in array myVars[]
        2. Calls function getFlickrPhotosAndMarkers(mapObject, myVars) to prepare Flickr API method and set markers
    PARAMS: 
        1. mapObject: Google Maps object created in function initiateGoogleMaps()
    RETURNS: NA
    */
    function plotWHSOnMap(mapObject, marker) {
        /*The text file URL used in experiment was: '../experiments/data/WHS_USA.txt'
            For the project, we will use the following: 
        */
        $.get('../project/data/WHS_list.txt', function (data) {
            var eachLine = data.split('\n');
            var myVars = new Array;
            for (i = 0; i < eachLine.length; i++) {
                var cell = eachLine[i].split('|');
                myVars[i] = {
                    'Name': cell[0],
                    'Location': cell[1],
                    'Latitude': parseFloat(cell[2]),
                    'Longitude': parseFloat(cell[3]),
                    'Tags': cell[4],
                    'WikiSearchTitle': cell[5],
                    'FiveHundredSearchTag': cell[6]
                }

            }
            //call function to position the markers and fetch flickr photos.
            getFlickrPhotosAndMarkers(mapObject, myVars);
        });
    }


    function ajaxCallWiki(placeData, i) {
        
        var wikiTitles = placeData[i].WikiSearchTitle;
        var wikiURL = wikiAPIURL + wikiTitles;
        $.ajax({
            url: wikiURL,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                $.each(data.query.pages, function (i, item) {
                    var htmlString = toString(item.extract);
                    $("#innerContentAreaDiv").empty();
                    $("#innerContentAreaDiv").append(item.extract);
                    //populate the href value of <a> tag with id="moreInfo"
                    var wikipageUrl = "https://en.wikipedia.org/wiki?curid=" + item.pageid;
                    $("#moreInfo").attr('href', wikipageUrl);
                });
            },
            error: function (xhr, status, er) { alert("Error ocurred in AJAX call to mediaWiki API: ", xhr.status); }
        });

    }


    function ajaxCall500px(placeData, i) {
        
        var fiveHundredPxKey = "UCtNbOxkcWYA6q66QmpMGPL4sUQ8oCgO5kkDkGMA";
        var fiveHundredPxTag = "";
        //var rppOne = "1";
        var rppTwentyFive = "25";
        var imageSize = "3"; //returns a 280px by 280px photo
        var fiveHundredPxTagMethod = "https://api.500px.com/v1/photos/search?consumer_key=";
        
        //get the tag from placeData[i]
        fiveHundredPxTag = placeData[i].FiveHundredSearchTag;
        var lat = placeData[i].Latitude;
        var lon = placeData[i].Longitude;
        var rad = "1";
        var randomnumber = 1 + Math.floor(Math.random() * 20);
        var fiveHundredPxGeo = lat + "," + lon + "," + rad;
        //construct the API URL
        var fiveHundredPxTagPhotoURL = fiveHundredPxTagMethod + fiveHundredPxKey + "&tag=" + fiveHundredPxTag + "&sort=favorites_count&page=1&rpp=" + rppTwentyFive + "&image_size=" + imageSize;
        //call to ajax
        $.ajax({
            url: fiveHundredPxTagPhotoURL,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $("#photoBoxOuter > img").attr('src', data.photos[randomnumber].image_url);
            },
            error: function (xhr, status, er) { alert("Error ocurred in AJAX call to 500px API: ", xhr.status); }
        });

    }

    function initialPageLoad()
    {
        $("#contentTitle").text("");
        $("#lat").text("");
        $("#lng").text("");
    }


    /********END OF FUNCTION DEFINITIONS********/
});