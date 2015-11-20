var menu = (function () {

    /*
     *  Define object.
     */
    var self                        =   {};
        self.dom                    =   {};

    /*
     *  Function to initialise module
     */
    self.init = function () {
        self.dom = $('.js-menu');

        if (!self.dom.length) {
            self.available = false;
            return false;
        } else {
            self.available = true;
            self.buildModule();    
        };
    };


    self.buildModule = function () {
        self.setTriggers();
    };

    self.setTriggers = function () {
        self.dom.find('.js-menu-logo').off('click').on('click', function(e){
            e.preventDefault();
            
            $(window).scrollTop(0);
        });

        self.dom.find('.js-menu-trigger').off('click').on('click', function(e){
            self.dom.toggleClass('expanded');
            $('#menu-shadow').toggleClass('active');
        });

        self.dom.find('.js-menu-item').off('click').on('click', function(e){
            e.preventDefault();

            var target  = $(this).attr('href');
            var top     = $(target).offset().top-40;

            $('html, body').animate({
                scrollTop: top
            });

            self.dom.removeClass('expanded');
            $('#menu-shadow').removeClass('active');
        });


        $(document).on('scroll.menu', function() {
            var scrollPos = $(document).scrollTop();

            $('.js-menu-item').each(function () {
                var currLink = $(this);
                var refElement = $(currLink.attr("href"));
                if (refElement.position().top <= scrollPos+40 && refElement.position().top + refElement.height() > scrollPos+40) {
                    $('.js-menu-item').removeClass("active");
                    currLink.addClass("active");
                }
                else{
                    currLink.removeClass("active");
                }
            });

            if($(window).scrollTop() + $(window).height() == $(document).height()) {
                $('.js-menu-item').removeClass("active");
                console.log($('.js-menu-item').eq($('.js-menu-item').length-1))
                $('.js-menu-item').eq($('.js-menu-item').length-1).addClass('active');
            }
        });
    };


    /*
     *  Return object.
     */
    return self;

})();
