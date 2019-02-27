/*!
 * https://github.com/snowplow/snowplow.github.com)
 * COSTUMERS REVAMP 2019
 */

/*var case_studies = [], case_studies_left = '', case_studies_right = '', case_studies_html = '';
var test_array = [];
var video_filter = '', videos_array = [];
var html_;
var media_pos = 0;*/

var cust_rev_selct = $('#revamp-case-studies-filter'); 
var cust_rev_cont = $('.revamp-case-studies'); 
var cust_rev_blck = $('.revamp-case-studies-block'); 



$(document).ready(function() {
 	
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

 	/*
 	 * Handle filters in case studies blocks
 	*/
 	cust_rev_selct.change(function(event) { 
 		var count = 0;
 		var option = $(this).find('option:selected').val()
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
 	});





}); // doc.ready


$(document).resize(function(event) {
	
});