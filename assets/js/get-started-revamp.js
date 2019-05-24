/**
 * Vars
 */

console.log('v3');
/**
 * Ready
 */
 $(document).ready(function() {

 	// check if it's mobile
 	/*if ( $( document ).width() < 768 ) vertical_tabs_is_mobile = true;*/
 	
 	$('.get-started-form-wrapper-front').click(function(event) {
 		var parent = $(this).parent('.get-started-form-wrapper');
 		$(parent).addClass('open');

 	});

 	/**
	 * Fake dropdown - Handle filters in case studies blocks
	*/
	$('.fake-dropdown').each(function(index, el) {
		var cust_rev_fake_drop = $(this);
		var cust_rev_opt = cust_rev_fake_drop.find('ul li');
		var cust_rev_label = cust_rev_fake_drop.find('label');
		var cust_rev_ipt = cust_rev_fake_drop.find('input[type=checkbox]');
		//Change dropdwon value
		cust_rev_opt.click(function(event) {
			cust_rev_fake_drop.attr( 'data-value', $(this).attr('data-value') );
			cust_rev_label.html( $(this).html() );
			cust_rev_ipt.prop('checked', false);
			/**/
			var count = 0;
	 		var option = $(this).attr('data-value');
	 		if ( option == 0 ) {
	 			
	 		} else {
	 			
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

 });



 $(window).resize(function(event) {
 	// check if it's mobile
 	/*if ( $( document ).width() < 768 ) vertical_tabs_is_mobile = true;
 	else vertical_tabs_is_mobile = false;*/
 });