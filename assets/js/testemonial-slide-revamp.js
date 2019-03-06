

var test_slider_rev_marker = $('.section-revamp-testemonial-markers'); 
var test_slider_rev_blck = $('.section-revamp-testemonial-block'); 




$(document).ready(function() {
 	
 	

 	/*
 	 * Change testemonial on marker click
 	*/
 	test_slider_rev_marker.click(function(event) {
 		var _index = $(this).index(); console.log(test_slider_rev_blck.eq(_index));
 		test_slider_rev_blck.removeClass('_active');
 		test_slider_rev_blck.eq(_index).addClass('_active');
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