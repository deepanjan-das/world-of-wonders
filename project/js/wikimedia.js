$(document).ready(function () {
    var wikiMethodBase = "http://en.wikipedia.org/w/api.php?";
    var wikiAction = "action=query";
    var wikiProp = "prop=extracts";
    var wikiFormat = "format=json";
    var wikiTitle = "titles=Mesa%20Verde%20National%20Park";

    //var wikiAPIURL = wikiMethodBase + wikiAction + wikiAction + "&" + wikiProp + "&" + wikiFormat + "&exintro=&" + wikiTitle;
    var wikiAPIURL = 'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Mesa%20Verde%20National%20Park';

    $.ajax({
        url: wikiAPIURL,
        type: 'GET',
        dataType: 'jsonp',
        success: function (data) {
            $.each(data.query.pages, function (i, item) {
                var htmlString = toString(item.extract);
                $("#contentArticle").append(item.extract);
            });
        },
        error: function (xhr, status, er) { console.log("Error ocurred in AJAX call to mediaWiki API: ", xhr.status); }
    });
});































































































