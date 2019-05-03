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
 			$('.snowplow-iglu-section').show();
 		} else {
 			$('.stickers-group').hide();
 			$('#'+stickers_target).show();
 			if (stickers_target == "sources") {
 				$('#destinations').css('margin-top', '80px');
 				$('.snowplow-iglu-section').show();
 			}
 			else {
 				$('#destinations').css('margin-top', '-80px');
 				$('.snowplow-iglu-section').hide();
 			}
 		}

 		// Change buttons state
 		$('.stickers-buttons').removeClass('active');
 		$(this).addClass('active');
 	});

 });