/*
* @Author: Dygon - Joana Oliveira
* @Date:   2019-02-14 22:27:59
* @Last Modified by:   Dygon - Joana Oliveira
* @Last Modified time: 2019-02-17 15:55:39
*/

(function($) { 

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

  $.fn.visible = function(partial) { 
    
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom; 
    
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };
    
})(jQuery);

$(window).scroll(function() { 

    $(".section-revamp-animated-img-left").each(function(i, el) {
        var el = $(el); 
        if (el.visible(true)) {
          el.find('img.section-revamp-animated-img-img').addClass("come-in-left"); 
        } 
    });

    $(".section-revamp-animated-img-right").each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.find('img.section-revamp-animated-img-img').addClass("come-in-right"); 
        } 
    });
  
});