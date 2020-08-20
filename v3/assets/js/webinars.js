$(document).ready(function(){
    console.log(window.location.pathname)
    const elOffset = $('#main-form').offset().top;
    
    $(window).scroll(function(){
        if(window.innerWidth > 810){ 
            // Define consts here as they are dynamic on width swap
            const elHeight = $('#main-form').height();
            const contentHeight = $('.webinar .form-submit .wrap > .left').height();
            // add/remove class to prevent form getting out of the window view.
            ($(window).scrollTop() > elOffset - 115) 
            ? $('#main-form').addClass('fixate')
            : $('#main-form').removeClass('fixate');
            // Limit how far can the form go below
            ($(window).scrollTop() > contentHeight - elHeight -150)
            ?  $('#main-form').addClass('static-bottom-form')
            && $('#main-form').removeClass('fixate')
            :  $('#main-form').removeClass('static-bottom-form');
        }
    });
});
