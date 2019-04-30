/**
 * Vars
 */
 var stickers_buttons = ".stickers-buttons";
 var stickers_groups = ".stickers-group";
 var stickers_target;
 var stickers_target_pos;

/**
 * Ready
 */
 $(document).ready(function() {
 	
 	$(stickers_buttons).click(function(event) {
 		// Get target
 		stickers_target = $(this).attr('data-ref');

 		// Get target Position
 		stickers_target_pos = $('#'+stickers_target).offset().top; 

 		// Scroll to position
 		$('html, body').animate({scrollTop: stickers_target_pos - $('nav.navbar').height() - 25}, 600);
 	});

 });