(function ($, window, undefined) {
    $(function () {
        var counter = 0, 
            $items = $('.slideshow figure'), 
            numItems = $items.length, 
            $titles = $('.photoTitle'), 
            $photogs = $('.photogName'); 

        var showCurrent = function () {
            var itemToShow = Math.abs(counter % numItems);// uses remainder (aka modulo) operator to get the actual index of the element to show  

            $items.removeClass('show'); 
            $items.eq(itemToShow).addClass('show');
            $titles.removeClass('revealTitle');
            $titles.eq(itemToShow).addClass('revealTitle');
            $photogs.removeClass('revealPhotog');
            $photogs.eq(itemToShow).addClass('revealPhotog');
        };

        $('.next').on('click', function () {
            counter++;
            showCurrent();

        });
        $('.prev').on('click', function () {
            counter--;
            showCurrent();
        });

        
    });
})(jQuery, window);