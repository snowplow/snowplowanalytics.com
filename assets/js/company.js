/*!
 * Snowplow v0.0.1 (https://github.com/snowplow/snowplow.github.com)
 * COMPANY
 */



(function ($)
{
	$('document').ready (function ()
	{
		var team = $('.team');
		var teamGrid = team.find('.grid');
		var teamItems = teamGrid.find('.item');
		var sep = $('<div class="sep col-xs-12 no-gutter"></div>');
			sep.height(0);
		var header = $('header');
		var teamTimeOut, scrollingTimeOut, bioClone;


		function hideBio ()
		{
			if (bioClone && bioClone.length>0)
				bioClone.detach ().remove ();

			sep.height(0).detach ().empty ();
			teamGrid.removeClass ('active');
			teamItems.removeClass ('active');
		}


		function showBio (el, bio, after)
		{
			bioClone = bio.clone();
			sep.empty ().append(bioClone).height(0);

			if (!after)
				sep.insertBefore (el);
			else
				sep.insertAfter (el);

			sep
			.height( bioClone.outerHeight() )
			.find('.i-close').on ('click', function (e)
			{
				e.preventDefault ();
				e.stopPropagation ();
				hideBio ();
			});

			sep.css('transform', 'perspective( 2000px ) rotateX(0)');
		}


		teamItems.on ('click', function (e)
		{
			clearTimeout (teamTimeOut);
			e.preventDefault ();

			teamGrid.addClass ('active');
			teamItems.removeClass ('active');

			var th = $(this);
				th.addClass ('active');
			var bio = th.find ('.bio');
			var rowPos = th.position().top;
			var nextItems = th.nextAll();
			var totalNextItems = nextItems.length;

			if (totalNextItems==0)
				showBio (th, bio, true);
			else
				nextItems.each (function (i)
				{
					var item = $(this);
					if (item.position().top > rowPos) // BREAK POINT
					{
						showBio (nextItems[i], bio);
						return false;
					}

					if (i+1==totalNextItems) // LAST ELEMENT
						showBio (item, bio, true);
				});

			// SCROLL TO FOCUS IN VIEW
			$('html, body').stop().animate({
				scrollTop: th.offset().top - header.height()
			});
		});

		$(window).on ('resize.company', function ()
		{
			var active = teamItems.filter ('.active');
			hideBio ();

			teamTimeOut = setTimeout (function (){
				if (active.length>0)
					active.trigger ('click');
			}, 750);
		});

		$(window).on ('touchstart.company mousewheel.company', function (){
			$('html, body').stop();
		});
	});

})(jQuery);