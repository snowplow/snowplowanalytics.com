var test_slider_rev_marker = $('.section-revamp-testemonial-markers'); 
var test_slider_rev_blck = $('.section-revamp-testemonial-block'); 
var test_slider_rev_arrow_left = $('.section-revamp-testemonial-block-container .i-arrow-left'); 
var test_slider_rev_arrow_right = $('.section-revamp-testemonial-block-container .i-arrow-right'); 
var test_slider_rev_pos = 0; 



$(document).ready(function() {
 	
 	

 	/*
 	 * Change testemonial on marker click
 	*/
 	test_slider_rev_marker.click(function(event) {
 		var _index = $(this).index(); 
 		test_slider_rev_blck.removeClass('_active');
 		test_slider_rev_blck.eq(_index).addClass('_active'); 		
 		test_slider_rev_marker.removeClass('_active');
 		test_slider_rev_marker.eq(_index).addClass('_active');
 	});

 	/**
 	 * Arrow left
 	 */
 	 test_slider_rev_arrow_left.click(function(event) {
 	 	if (test_slider_rev_pos > 0) {
 	 		test_slider_rev_pos--;
 	 		test_slider_rev_blck.removeClass('_active');
	 		test_slider_rev_blck.eq(test_slider_rev_pos).addClass('_active'); 		
	 		test_slider_rev_marker.removeClass('_active');
	 		test_slider_rev_marker.eq(test_slider_rev_pos).addClass('_active');
 	 	}
 	 }); 


 	/**
 	 * Arrow right
 	 */
 	 test_slider_rev_arrow_right.click(function(event) {
 	 	if (test_slider_rev_pos < (test_slider_rev_blck.length - 1)) {
 	 		test_slider_rev_pos++;
 	 		test_slider_rev_blck.removeClass('_active');
	 		test_slider_rev_blck.eq(test_slider_rev_pos).addClass('_active'); 		
	 		test_slider_rev_marker.removeClass('_active');
	 		test_slider_rev_marker.eq(test_slider_rev_pos).addClass('_active');
 	 	}
 	 }); 





}); // doc.ready


$(document).resize(function(event) {
	
});