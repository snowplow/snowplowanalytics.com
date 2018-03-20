$(document).ready(function() { console.log('country_');
	
	$('.filter-by-location').click(function(event) {
		event.preventDefault();

		var country_ = $(this).attr('data-country'); 

		if (country_ == 0 || country_ == '0') {
			$('.filter-by-location').removeClass('active_');
			$(this).addClass('active_');

			$('.filtered-by-location').fadeOut().addClass('hidden_');
			$('.filtered-by-location').fadeIn(300).removeClass('hidden_');
		} else {
			$('.filter-by-location').removeClass('active_');
			$(this).addClass('active_');

			$('.filtered-by-location').fadeOut().addClass('hidden_');
			$('.filtered-by-location[data-country="'+country_+'"]').fadeIn(300).removeClass('hidden_');
		}

		checkDivs(1);

	});

	checkDivs(0);

	function checkDivs(pos_) {
		$('.filtered-by-location').removeClass('no_border_');
		if (pos_ == 0) {
			$('.filtered-by-location').each(function(index, el) {
				if (index > 0) {
					if ($(el).hasClass('blue_')) {
						$('.filtered-by-location').eq(index - 1).addClass('no_border_');
					}
				}
			});
		} else {
			$('.filtered-by-location:not(.hidden_)').each(function(index, el) { 
				if (index > 0) {
					if ($(el).hasClass('blue_')) {
						$('.filtered-by-location').eq(index - 1).addClass('no_border_');
					}
					if (index == $('.filtered-by-location:not(.hidden_)').length-1) {
						$(el).addClass('no_border_');
					}
				}
			});
		}
	}

});