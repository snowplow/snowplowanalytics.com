/*!
 * Snowplow v0.0.1 (https://github.com/snowplow/snowplow.github.com)
 */

(function ($)
{
	/*
	 * Lets set all vars
	 */

	// Declared but waiting for values
	var slick;

	// Declared with values
	var win = $(window);
	var winScrollTop = 0;
	var body = $('body');
	var scrollingTimeOut = 0;


	/*
	 * Once document is loaded we start our script
	 */

	$('document').ready (function ()
	{
		/*
		 * Check document for any sliders
		*/

		slick = $('.slick');
		slick.each (function ()
		{
			var th = $(this);
			var fade = th.attr ('data-slick-fade') == '1';
			var dots = th.attr ('data-slick-dots') != '0';
			var arrows = th.attr ('data-slick-arrows') != '0';
			var autoplay = th.attr ('data-slick-autoplay') != '0';
			var infinite = th.attr ('data-slick-infinite') != '0';
			var selector = th.attr ('data-slick-selector');
			var controls = th.attr ('data-slick-controls');
			if (controls.length<=0)
				controls = null;


			th.slick ({
				fade: fade,
				dots: dots,
				arrow: arrows,
				slide: selector,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: autoplay,
				infinite: infinite,
				focusOnSelect: true,
				appendDots: controls,
				appendArrows: controls,
				prevArrow: '<button type="button" data-role="none" aria-label="Previous" role="button" class="slick-prev slick-arrow"><i class="i-arrow-left"></i></button>',
				nextArrow: '<button type="button" data-role="none" aria-label="Next"     role="button" class="slick-next slick-arrow"><i class="i-arrow-right"></i></button>'
			});
		});


		/*
		 * Control scrolling events
		 */

		function onScroll (e)
		{
			if (body.is('.lock-scroll'))
			{
				e.preventDefault();
				e.stopPropagation ();
				win.scrollTop ( winScrollTop );
				return false;
			}

			/*
			 * Window SCROLLING
			 * For performance whise we apply css pointer-events:none to body
			 */

			if (!body.is('.scrolling'))
			{
				body.addClass ('scrolling');
			slick.slick('slickPause');
			}

			clearTimeout(scrollingTimeOut);
			setTimeout (function ()
			{
				slick.slick('slickPlay');
				body.removeClass ('scrolling');
			}, 1000);

			/*
			 * Window SCROLLED
			 */

			winScrollTop = win.scrollTop ();

			if (winScrollTop >= 80)
				body.addClass ('scrolled');
			else
				body.removeClass ('scrolled');
		}

		 win.scroll (onScroll);
	});


})(jQuery);