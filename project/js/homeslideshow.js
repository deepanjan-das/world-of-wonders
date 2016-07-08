$(document).ready(function () {
    $("#autoSlide > div:gt(0)").hide();
    setInterval(function () {
        $("#autoSlide > div:first")
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo("#autoSlide");
    }, 4000);

});