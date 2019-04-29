/**
 * Vars
 */
 var vertical_tabs_obj = '.vertical-tabs-container';
 var vertical_tabs_obj_this;
 var vertical_tabs_head = '.vertical-tabs-header';
 var vertical_tabs_body = '.vertical-tabs-body';
 var vertical_tabs_target;


/**
 * Ready
 */
 $(document).ready(function() {
 	
 	$(vertical_tabs_head).click(function(event) {
 		// get this object (to avoid messing with other instances)
 		vertical_tabs_obj_this = $(this).parents(vertical_tabs_obj);

 		// get target tab
 		vertical_tabs_target = $(this).attr('data-ref');  

 		// switch to target tab
 		vertical_tabs_obj_this.find(vertical_tabs_body).removeClass('active');
 		vertical_tabs_obj_this.find('#'+vertical_tabs_target).addClass('active');

 		// switch active tab header
 		vertical_tabs_obj_this.find(vertical_tabs_head).removeClass('active');
 		$(this).addClass('active');
 	});

 });