/**
 * Vars
 */
 var stickers_buttons = ".stickers-buttons";
 var stickers_groups = ".stickers-group";
 var stickers_target;

/**
 * Ready
 */
 $(document).ready(function() {
 	
 	$(stickers_buttons).click(function(event) {
 		// Get target
 		stickers_target = $(this).attr('data-ref');

 		// Hide or show sections
 		if (stickers_target == 0) {
 			$('.stickers-group').show();
 		} else {
 			$('.stickers-group').hide();
 			$('#'+stickers_target).show();
 		}

 		// Change buttons state
 		$('.stickers-buttons').removeClass('active');
 		$(this).addClass('active');
 	});

 });