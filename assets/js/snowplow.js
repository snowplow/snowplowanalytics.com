---
---

{% include_relative vendors/_concat/jquery-3.1.1.min.js %}
{% include_relative vendors/_concat/jquery.cookiebar.js %}
{% include_relative vendors/_concat/bootstrap.min.js %}
{% include_relative vendors/_concat/bootstrap-select.min.js %}
{% include_relative vendors/_concat/grayscale.functions.js %}
{% include_relative vendors/_concat/grayscale.js %}
{% include_relative vendors/_concat/slick.min.js %}
{% include_relative vendors/_concat/masonry.pkgd.min.js %}
{% include_relative vendors/_concat/jssocials.min.js %}


/*!
 * Snowplow v0.0.1 (https://github.com/snowplow/snowplow.github.com)
 * PLUGINS AND UTILITIES
 */

function isElementInViewport(el) {
    //http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport

    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return rect.bottom > 0 &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ ;
}


function getBootstrapBreakpoint() {
    var w = $(document).innerWidth();
    return (w < 768) ? 'xs' : ((w < 992) ? 'sm' : ((w < 1200) ? 'md' : 'lg'));
}

if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}



(function($) {
    /*
     * Once document is loaded we start our script
     */

    $('document').ready(function() {
        /*
         * Lets set all vars
         */

        // Declared but waiting for values
        var slick;

        // Declared with values
        var win = $(window);
        var winScrollTop = 0;
        var scrollingTimeOut = 0;
        var body = $('body');
        var header = $('header');





        /**
         * Launch Cookie Consent
         */
        $.cookieBar({
            append: false,
            element: '#cookie',
            acceptButton: true,
            acceptText: 'Continue',
            policyButton: true,
            policyText: 'Learn more',
            message: '<div class="col-sm-10"><h3 class="cookie-title">Snowplow cookie policy</h3>We use cookies on this website to track how our users are browsing and engaging with it. We use that to figure out how good we are at introducing Snowplow to prospective companies and how well we serve existing users with documentation and other supporting material. <a href="/terms-of-service/">Click here</a> for more information..</div>'
        });

        var cookie = $('#cookie');
        if (cookie.children().length) {
            body.addClass('cookie');
            // ON COOKIE ACCEPT REMOVE CONTAINER
            $('#cookie .cb-enable').on('click', function() {
                body.removeClass('cookie');
            });
        } else {
            cookie.remove();
        }



        /*
         * Check document for any sliders
         */

        slick = $('.slick');
        slick.each(function() {
            var th = $(this);
            var fade = th.attr('data-slick-fade') == '1';
            var dots = th.attr('data-slick-dots') != '0';
            var speed = th.attr('data-slick-speed') || 800;
            var autoplaySpeed = th.attr('data-slick-autoplay-speed') || 12000;
            var selector = th.attr('data-slick-selector');
            var arrows = th.attr('data-slick-arrows') != '0';
            var infinite = th.attr('data-slick-infinite') != '0';
            var autoplay = th.attr('data-slick-autoplay') != '0';
            var slidesToShow = parseFloat(th.attr('data-slick-show')) || 1;
            var slidesToScroll = parseFloat(th.attr('data-slick-scroll')) || 1;
            var adaptiveHeight = th.attr('data-slick-adaptive-height') == '1';
            var controls = th.attr('data-slick-controls');
            if (controls.length <= 0)
                controls = null;

            th.slick({
                dots: dots,
                fade: fade,
                speed: speed,
                arrow: arrows,
                slide: selector,
                autoplay: autoplay,
                infinite: infinite,
                focusOnSelect: true,
                appendDots: controls,
                appendArrows: controls,
                slidesToShow: slidesToShow,
                autoplaySpeed: autoplaySpeed,
                slidesToScroll: slidesToScroll,
                adaptiveHeight: adaptiveHeight,
                prevArrow: '<button type="button" data-role="none" aria-label="Previous" role="button" class="slick-prev slick-arrow"><i class="i-arrow-left"></i></button>',
                nextArrow: '<button type="button" data-role="none" aria-label="Next"     role="button" class="slick-next slick-arrow"><i class="i-arrow-right"></i></button>'
            });
        });



        /*
         * Check document for any sliders
         */

        var maps = $('.map');
        if (maps.length > 0) {
            if ('google' in window == false) {
                $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC53hH9JnDOILAqpXQsEtpcpfr3lt0LSl0")
                    .done(function(script, textStatus) {
                        maps.each(function() {
                            var th = $(this);

                            var lat = parseFloat(th.attr('data-map-lat'));
                            var lng = parseFloat(th.attr('data-map-lng'));
                            var zom = parseFloat(th.attr('data-map-zoom'));
                            var mrk = th.attr('data-map-marker');
                            var mlt = parseFloat(th.attr('data-map-marker-lat'));
                            var mlg = parseFloat(th.attr('data-map-marker-lng'));

                            if (!lat || !lng)
                                return true; // CONTINUE WITH THE REST

                            var map = new google.maps.Map(this, {
                                zoom: zom || 16,
                                scrollwheel: false,
                                center: new google.maps.LatLng(lat, lng),
                                styles: [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "lightness": -100 }, { "visibility": "off" }, { "saturation": "-77" }, { "color": "#000000" }] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#737880" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "saturation": "-70" }, { "lightness": "0" }, { "visibility": "on" }, { "color": "#e4e8ee" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "hue": "#0066ff" }, { "saturation": "0" }, { "lightness": "0" }] }, { "featureType": "landscape", "elementType": "labels", "stylers": [{ "saturation": "-80" }, { "lightness": "-90" }, { "visibility": "off" }, { "color": "#737880" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "saturation": "-80" }, { "lightness": "-70" }, { "visibility": "off" }, { "gamma": "1" }, { "color": "#c0ccdf" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "color": "#737880" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "saturation": "-85" }, { "lightness": "60" }, { "visibility": "on" }, { "color": "#f5f9ff" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "saturation": "-70" }, { "lightness": "50" }, { "visibility": "off" }, { "color": "#737880" }] }, { "featureType": "road.local", "elementType": "all", "stylers": [{ "saturation": "0" }, { "lightness": "-11" }, { "visibility": "on" }, { "color": "#f5f9ff" }] }, { "featureType": "road.local", "elementType": "labels", "stylers": [{ "color": "#61656b" }] }, { "featureType": "road.local", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "visibility": "simplified" }, { "lightness": "0" }, { "saturation": "0" }, { "color": "#f5f9ff" }] }, { "featureType": "transit", "elementType": "labels", "stylers": [{ "lightness": -100 }, { "visibility": "off" }, { "color": "#737880" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "saturation": "0" }, { "lightness": 100 }, { "visibility": "on" }, { "color": "#c6daf8" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "saturation": -100 }, { "lightness": -100 }, { "visibility": "off" }, { "color": "#e4e8ee" }] }]
                            });

                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(mlt ? mlt : lat, mlg ? mlg : lng),
                                map: map,
                                draggable: false,
                                icon: mrk ? mrk : window.location.origin + '/assets/img/common/icon-marker.png'
                            });
                        });
                    })
                    .fail(function(jqxhr, settings, exception) {
                        maps.remove();
                    });
            }
        }



        /*
         * WINDOW HASH AND SCROLL TO ANCHORS
         */

        $('a[href^="#"]').on('click', function(e) {
            var hash = this.hash;
            if (hash) {
                var target = $(hash);
                if (target.length) {
                    e.preventDefault();
                    var top = target.offset().top - header.height() - 70;
                    $("html, body").animate({ scrollTop: top }, 1000, function() {
                        window.location.hash = hash;
                        $("html, body").animate({ scrollTop: top }, 0);
                    });
                }
            }
        });

        if (window.location.hash != '') {
            var hash = window.location.hash;
            window.location.hash = '';

            var target = $(hash);
            if (target.length > 0) {
                var top = target.offset().top - header.height() - 70;
                $("html, body").animate({ scrollTop: top }, 1000, function() {
                    window.location.hash = hash;
                    $("html, body").animate({ scrollTop: top }, 0);
                });
            }
        }




        /*
         * MUTED LINKS
         */
        $('a.mute-link').on('click mouseup', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })




        /*
         * WINDOW composition
         */

        // $('.window').each (function ()
        // {
        // 	var th = $(this);
        // 	var src = th.find ('.box-image img');
        // 	if (src.length>0)
        // 		src = src.attr ('src'); // WE PICK UP THE FIRST ONE
        // 	if (src)
        // 		th.css ('background-image', 'url('+src+')' );
        // });




        /*
         * BLOCK TEXT IMG
         */

        $('.block-text-img').each(function() {
            var th = $(this);
            var blockImg = th.find('.block-img');
            var tagImg = th.find('.block-img img');
            if (blockImg.length > 0 && tagImg.length > 0) {
                blockImg.css('background-image', 'url(' + tagImg.attr('src') + ')');
            }
        });




        /*
         * Remove drag of images
         */

        $('img').prop('draggable', false);





        /*
         * Control scrolling events
         */

        function onScroll(e) {
            var parralaxHeader = $('.hero.parallax');

            if(parralaxHeader.length){

                var hT = parralaxHeader.offset().top,
                    hH = parralaxHeader.outerHeight(),
                    wH = $(window).height(),
                    wS = $(this).scrollTop();
                if (wS < hH && wS != 0){
                    console.log("HT :"+ hT);
                    console.log("hH :"+ hH);
                    console.log("wH :"+ wH);
                    console.log("wS :"+ wS);
                    console.log("hT+hH-wH :"+ (hT+hH-wH));

                    parralaxHeader.addClass('animate');
                    console.log("Entrei");

                }else{
                    parralaxHeader.removeClass('animate');

                    console.log("Sai");
                }
                if (body.is('.lock-scroll')) {
                    e.preventDefault();
                    e.stopPropagation();
                    win.scrollTop(winScrollTop);
                    return false;
                }
            }

            /*
             * Window SCROLLING. For performance whise we could apply
             * css pointer-events:none to body.
             */

            if (!body.is('.scrolling')) {
                body.addClass('scrolling');
                slick.slick('slickPause');
            }


            clearTimeout(scrollingTimeOut);
            scrollingTimeOut = setTimeout(function() {
                body.removeClass('scrolling');
                slick.each(function() {
                    var th = $(this);
                    if (isElementInViewport(this) && th.slick('slickGetOption', 'autoplay'))
                        th.slick('slickPlay');
                });
            }, 1000);

            /*
             * Window SCROLLED
             */

            winScrollTop = win.scrollTop();

            if (winScrollTop >= 80) {
                body.addClass('scrolled');
            } else {
                body.removeClass('scrolled');
            }
        }


        win.scroll(onScroll).trigger('scroll');



        /**
         * BLOG SOCIAL ICONS
         */
		$(".social-buttons").jsSocials({
			showLabel: false,
			showCount: false,
			shares: {{ site.share_list | join: "', '" | prepend: "['" | append: "']" }}
		});



        /**
         * MASONRY
         */
        var msnry = $('.js-masonry');
        if (msnry.length) {
            setTimeout(function (){
                msnry.masonry();
            }, 300);
        }
    });


})(jQuery);