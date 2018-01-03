/*!
 * https://github.com/snowplow/snowplow.github.com)
 * COSTUMERS REVAMP
 */

var case_studies = [], case_studies_left = '', case_studies_right = '', case_studies_html = '';
var test_array = [];
var video_filter = '', videos_array = [];
var html_;
var media_pos = 0;

$(document).ready(function() {
 	
 	/*
 	 * SnowPlow btn side bars
 	*/
 	$('.snowplw-btn-container').each(function(index, el) {
 		var pad_ = 50;
 		var btn_width = $(el).find('.snowplw-btn').outerWidth();
 		$(el).find('.snowplw-btn-sides').css('width', 'calc(50% - '+(btn_width/2 + pad_)+'px)');
 	});



 	/*
 	 * Align Case Studies
 	*/
 	case_studies_left = '';
 	case_studies_right = '';

 	$('.case-studies-block').each(function(index, el) {
 		case_studies_html = '<div class="case-studies-block ' + $(el).attr('data-class') + '">' + $(el).html() + '</div>';
 		if (index % 2 == 0) {
 			case_studies_left += case_studies_html;
 		} else {
 			case_studies_right += case_studies_html;
 		}
 	});
 	case_studies_html = '';
 	case_studies_html += '<div class="case-studies-container-left col-sm-6">';
 	case_studies_html += case_studies_left;
 	case_studies_html += '</div>';
 	case_studies_html += '<div class="case-studies-container-right col-sm-6">';
 	case_studies_html += case_studies_right;
 	case_studies_html += '</div>';
 	$('.case-studies-container').html(case_studies_html);
 	




 	/*
 	 * Refresh Testemonials
 	*/
 	// 1. get testemonials
 	$('.testemonials-block').each(function(index, el) {
 		var class_ = $(el).attr('class');
 		html_ = '';
 		html_ += '<div class="';
 		html_ += class_;
 		html_ += '">';
 		html_ += $(el).html();
 		html_ += '</div>';
 		test_array[test_array.length] = html_;
 	});

 	// 2. onclick
 	$('#btn_refresh_testemonials').click(function(event) {
 		// shuffle array
 		Shuffle(test_array);

 		// write new htm with shuffled array
 		html_ = '';
 		$.each(test_array, function(index, val) {
 			html_ += val;
 		});
 		$('.testemonials-block-container .row').html(html_);

 	});

 	// 3. Function
 	function Shuffle(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};




	/*
 	 * Logos Companies Effect
 	*/
	$card	= $( '.users-block' );
	$card.on( 'mousemove', function( e ) {
		var $this		= $( this ),
			eX			= e.offsetX,
			eY			= e.offsetY,
			dim			= this.getBoundingClientRect();
			w			= dim.width/2,
			h			= dim.height/2,
			tiltLimit	= 15,
			posX		= ( h - eY ) * ( tiltLimit / h );
			posY		= ( w - eX ) * ( tiltLimit / w ) * -1;

		$this.css({
			'transform': 'rotateX( ' + posX + 'deg ) rotateY( ' + posY + 'deg )',
			'box-shadow': ( posY * -1 ) + 'px ' + ( posX + 14 ) + 'px 34px 0 rgba( 0, 0, 0, 0.1 )'
		});
		
		$this.find( '.highlight' ).css({
			'opacity': 1,
			'transform': 'translate3d( ' + ( posX * -4 ) + 'px, ' + ( posY * -4 ) + 'px, '  + '0 )'
		});
	});

	$card.mouseleave( function( e ) {
		var $el = $( this );

		$el.removeAttr( 'style' ).addClass( 'hover--ending' );

		setTimeout( function() {
			$el.removeClass( 'hover--ending' );
		}, 500 );
		
		$el.find( '.highlight' ).removeAttr( 'style' );
	});



	/*
 	 * Logos Companies Show/Hide
 	*/
	$('#btn_users').click(function(event) {
		if ($('.users-block-container').hasClass('visible')) {
			$('.users-block-container').removeClass('visible');
			$(this).html('Load More Users');
			 $('html,body').animate({
		        scrollTop: $("section.users").offset().top},
		        'slow');
		} else {
			$('.users-block-container').addClass('visible');
			$(this).html('Hide Users');
		}
	});



	/*
 	 * Change Videos
 	*/
 	$('.videos-block').each(function(index, el) {
 		var class_ = $(this).attr('class');
 		video_filter = $(this).attr('data-filter');
 		html_ = '';
 		html_ += '<div class="';
 		html_ += class_;
 		html_ += '" data-filter="';
 		html_ += video_filter;
 		html_ += '"">';
 		html_ += $(this).html();
 		html_ += '</div>';
 		videos_array[videos_array.length] = { 'html' : html_, 'filter' : video_filter };
 	});
 	$('.videos-filters li').click(function(event) {
 		$('.videos-filters li').removeClass('active');
 		$(this).addClass('active');
 		video_filter = $(this).attr('data-filter');
 		html_ = '';
 		if (video_filter == 'all') {
 			$.each(videos_array, function(index, val) {
 				html_ += val.html;
 			});			
 		} else {
 			$.each(videos_array, function(index, val) {
 				if (val.filter == video_filter) html_ += val.html;
 			});
 		}
 		$('.videos-block-container').html(html_);
 	});



 	/*
 	 * Media cards handler
 	*/
 	// 1. Wrapper width
 	$('.media-blocks-wrapper').width($('.media-blocks').length * ($('.media-blocks').outerWidth() + 15));
 	// 2. Arrows movement
 	$('.media-arrow').click(function(event) {
 		if (!$(this).hasClass('inactive')) {
 			if ($(this).hasClass('right')) media_pos++; 
 			else media_pos--;
	 		$('.media-blocks-wrapper').css({
	 			'translate': 'translate('+(-1)*media_pos*($('.media-blocks').outerWidth() + 15)+'px)',
	 			'-webkit-transform': 'translate('+(-1)*media_pos*($('.media-blocks').outerWidth() + 15)+'px)',
	 			'-ms-transform': 'translate('+(-1)*media_pos*($('.media-blocks').outerWidth() + 15)+'px)',
	 			'-o-transform': 'translate('+(-1)*media_pos*($('.media-blocks').outerWidth() + 15)+'px)'
	 		});
	 		//tests
	 		$('.media-arrow').removeClass('inactive');
	 		if (media_pos == 0) $('.media-arrow.left').addClass('inactive');
	 		if (media_pos == ($('.media-blocks').length -2) && $(window).outerWidth() > 767) $('.media-arrow.right').addClass('inactive');
	 		if (media_pos == ($('.media-blocks').length -1) && $(window).outerWidth() < 768) $('.media-arrow.right').addClass('inactive');
 		}
 	});




 	 










}); // doc.ready


$(document).resize(function(event) {
	/*
 	 * Media cards handler
 	*/
 	$('.media-blocks-wrapper').width($('.media-blocks').length * ($('.media-blocks').outerWidth() + 15));
});