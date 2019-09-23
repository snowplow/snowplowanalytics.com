//Small input field validator
var validateInput = function(kind, value){
    value = value ? value.trim() : ''
    switch(kind) {
        case 'name':
            return (value.length > 1)
        case 'email':
          return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
        case 'company':
            return (value.length > 1)
    }
}


//Submit JSONP call to Pardot
var pardotSubmit = function (data){

    var url = 'https://go.snowplowanalytics.com/l/571483/2019-09-17/3s1twb6'
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
        ? $('#nl-form').hide() 
            && $('.thankyou').fadeIn(700)
            && dataLayer.push({ 'event': 'newsletter' })
        : $('input').addClass('error') 
            && $('#form_submit_button').removeClass('activate-loader')
    }
}

// push to GTM


//Remove any validation when user tries to rewrite the field
$('input').focus(function(){
    $(this).removeClass('error')
})

// Validate and Submit
var handleSubmit = function(e){
    e.preventDefault();
    var data = {};
    data.email = $('#email').val()
    
    // Snowplow tracker -- Retreive DomainUserId
    snowplow(function () {
        data['00N2400000HRtrl'] = this.snplow5.getDomainUserId();
    });

    //Validate email and color invalid input field
    !validateInput('email', data.email) 
    && $('#email').addClass('error');
    
    //Submit form if all pass
    (validateInput('email', data.email))
        && $('#form_submit_button').addClass('activate-loader') 
        && pardotSubmit(data) 
}

var form = document.getElementById('newsletter-form');
form.addEventListener('submit', handleSubmit);
