$(document).ready(function () {
    causeRepaintsOn = $(".title, .topmenu-li, .subheading, .description");
    $(window).resize(function () {
        causeRepaintsOn.css("z-index", 1);
    });
});