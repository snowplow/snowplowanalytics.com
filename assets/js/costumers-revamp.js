/*!
 * https://github.com/snowplow/snowplow.github.com)
 * COSTUMERS REVAMP 2019
 */

var cust_rev_selct = $('#revamp-case-studies-filter'); 
var cust_rev_cont = $('.revamp-case-studies'); 
var cust_rev_blck = $('.revamp-case-studies-block'); 
var cust_rev_fake_drop, cust_rev_opt, cust_rev_label, cust_rev_ipt;

function is_touch_device() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
    return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

$(document).ready(function() {

	/**
	 * Fake dropdown - Handle filters in case studies blocks
	*/
	$('.fake-dropdown').each(function(index, el) {
		cust_rev_fake_drop = $(this);
		cust_rev_opt = cust_rev_fake_drop.find('ul li');
		cust_rev_label = cust_rev_fake_drop.find('label');
		cust_rev_ipt = cust_rev_fake_drop.find('input[type=checkbox]');
		//Change dropdwon value
		cust_rev_opt.click(function(event) {
			cust_rev_fake_drop.attr( 'data-value', $(this).attr('data-value') );
			cust_rev_label.html( $(this).html() );
			cust_rev_ipt.prop('checked', false);
			/**/
			var count = 0;
	 		var option = $(this).attr('data-value');
	 		if ( option == 0 ) {
	 			cust_rev_blck.addClass('_visible');
	 			var count___ = 0;
			 	cust_rev_blck.each(function(index, el) {
					if (count___ % 3 == 0) $(el).addClass('mg_0');
					else $(el).removeClass('mg_0');
					count___++;		
				});
	 		} else {
	 			cust_rev_blck.each(function(index, el) {
	 				if ($(el).attr('data-filter') == option) {
						$(el).addClass('_visible');
						if (count % 3 == 0) $(el).addClass('mg_0');
						else $(el).removeClass('mg_0');	
						count++;
					} else {
						$(el).removeClass('_visible').removeClass('mg_0');
					}
	 			});
	 		}
			/**/
		});
		//close it on hover out
		$(this).hover(function() {
			//do nothing
		}, function() {
			cust_rev_ipt.prop('checked', false);
		});
	});
 	
 	/*
 	 * Show all case studies blocks when page loads
 	*/
 	cust_rev_blck.addClass('_visible');
 	var count___ = 0;
 	cust_rev_blck.each(function(index, el) {
		if (count___ % 3 == 0) $(el).addClass('mg_0');
		else $(el).removeClass('mg_0');
		count___++;		
	});
 	

 	/**
 	 * Correct Hover on mobile devices
 	 */
 	 cust_rev_blck.click(function(event) {
 	 	//console.log( is_touch_device() );
 	 });





}); // doc.ready


$(document).resize(function(event) {
	
});