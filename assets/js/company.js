/*!
 * Snowplow v0.0.1 (https://github.com/snowplow/snowplow.github.com)
 * COMPANY
 */
;(function($) {
    $('document').ready(function() {
        var team = $('.team');
        var teamGrid = team.find('.grid');
        var teamItems = teamGrid.find('.item');
        var sep = $('<div class="sep col-xs-12 no-gutter"></div>').height(0);
        var header = $('header');
        var teamTimeOut, scrollingTimeOut, bioClone, lastActiveElement;


        function hideBio(callback) {
            if (bioClone) {
            	if (bioClone.length) {
	                sep
	                .add(bioClone)
	                .height(0)
					.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
	                    bioClone.detach().remove();
	                    sep.height(0).detach().empty();
	                    teamGrid.removeClass('active');
	                    teamItems.removeClass('active');

	                    sep.unbind ('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
		                
		                if (callback) {
		                	callback();
		                }
					});
				}
            } else {
                sep
                .height(0)
                .detach()
                .empty()
				.unbind ('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

                teamGrid.removeClass('active');
                teamItems.removeClass('active');

                if (callback) {
                	callback();
                }
            }
        }


        function showBio(el, bio, after) {

            // SCROLL TO FOCUS IN VIEW
            $('html, body').stop().animate({ scrollTop: bio.offset().top - header.height() },
                function() {
                    bioClone = bio.clone();
                    sep
					.unbind ('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
                    .empty()
                    .html(bioClone)
                	.css({
                		height: 0,
                		opacity: 0,
                		transform : 'perspective(2000px) rotateX(20deg)'
                	})
                    .find('.i-close').on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        lastActiveElement = null;
                        hideBio();
                    });

                    if (!after) {
                        sep.insertBefore(el);
                    } else {
                        sep.insertAfter(el);
                    }

					$('html, body').scrollTop(bio.offset().top - header.height());

                    setTimeout(function () {
	                    sep.css({
	                    	opacity: 1,
	                		height: bioClone.outerHeight(),
	                		transform : 'perspective(2000px) rotateX(0deg)'
	                	});

	                    $('html, body').scrollTop(bio.offset().top - header.height());
                    }, 1);
                }
            );
        }


        teamItems.on('click', function(e) {
            clearTimeout(teamTimeOut);
            e.preventDefault();

            teamGrid.addClass('active');
            teamItems.removeClass('active');

            var th = $(this);
            th.addClass('active');
            lastActiveElement = th;
            var bio = th.find('.bio');
            var rowPos = th.position().top;
            var nextItems = th.nextAll();
            var totalNextItems = nextItems.length;

            if (totalNextItems === 0) {
                showBio(th, bio, true);
            } else {
                nextItems.each(function(i) {
                    var item = $(this);
                    if (item.position().top > rowPos) { // BREAK POINT
                        showBio($(nextItems[i]), bio);
                        return false;
                    }

                    if (i + 1 == totalNextItems) { // LAST ELEMENT
                        showBio(item, bio, true);
                    }
                });
            }
        });

        $(window).on('resize.company', function() {
            hideBio();

            clearTimeout('teamTimeOut');
            teamTimeOut = setTimeout(function() {
                if (lastActiveElement) {
                    lastActiveElement.trigger('click');
                }
            }, 1000);
        });

        $(window).on('touchstart.company mousewheel.company', function() {
            $('html, body').stop();
        });
    });

})(jQuery);