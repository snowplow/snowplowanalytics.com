// TODO : Combine with v3 assets js


//Small input field validator
var validateInput = function(kind, value){
    value = value ? value.trim() : ''
    switch(kind) {
        case 'not_empty':
            return (value.length > 1)
        case 'email':
          return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
    }
}


//Submit JSONP call to Pardot
var pardotSubmit = function (data){

    var url = $("#newsletter-footer-form").attr("data-pardotUrl");
    $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        data: data
    });
    //Callback Directly from our own assets.Pardot does not allow CORS calls. Success and Error scripts - /assets/js/pardot (callback takes res from there)
    window.callback = function (data) {
        //Handle thankyou fadein on success or color every input if pardot error
        (data.result == 'success') 
        ? $('#newsletter-footer-form .form-wrap').hide() 
            && $('#newsletter-footer-form .thankyou').fadeIn(700)
            && $('#newsletter-footer-form .thankyou').css('display','flex')
            // push an event to GTM
            && dataLayer.push({ 'event': $("#newsletter-footer-form").attr("data-gtmEventName") })
        : $('input').addClass('error') 
            && $('#newsletter-footer-form #form_submit_button').removeClass('activate-loader')
    }
}




// Validate and Submit
var handleSubmit = function(e){
    e.preventDefault();
    var email =  $('#newsletter-email').val();
    var data = {};
    // Populate DUID
    window.snowplow && window.snowplow(function () {
        data['00N2400000HRtrl'] = this.snplow5.getDomainUserId();
    });
    data['newsletter-email'] =  $('#newsletter-email').val();

    !validateInput('email', email) ? $('#newsletter-email').addClass('error') : $('#newsletter-footer-form #form_submit_button').addClass("activate-loader") && pardotSubmit(data);
}


// VISUAL HELPERS

//Remove any validation when user tries to rewrite the field
$('input').focus(function(){
    $(this).removeClass('error')
})


// BIND FORM WITH HELPER

var form = document.getElementById('newsletter-footer-form');
form && form.addEventListener('submit', handleSubmit);
