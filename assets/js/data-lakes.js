//Small input field validator
var validateInput = function(kind, value){
    value = value ? value.trim() : ''
    switch(kind) {
        case 'name':
            return (value.length > 1 && /^[a-zA-Z]+$/.test(value))
        case 'email':
          return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
        case 'company':
            return (value.length > 1)
    }
}


//Submit JSONP call to Pardot
var pardotSubmit = function (data){

    // Run loader
    

    var url = 'http://go.snowplowanalytics.com/l/571483/2019-07-05/3rzfqqq'
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
        ? $('#pdf-form').hide() 
            && $('.thankyou').fadeIn(700)
        : $('input').addClass('error') 
            && $('#form_submit_button').removeClass('activate-loader')
    }
}

//Remove any validation when user tries to rewrite the field
$('input').focus(function(){
    $(this).removeClass('error')
})

// Validate and Submit
var handleSubmit = function(e){
    e.preventDefault();
    var data = {};
    data.first_name	 = $('#first_name').val()
    data.last_name	 = $('#last_name').val()
    data.email = $('#email').val()
    data.company = $('#company').val()

    //Validate fields and color invalid input fields
    !validateInput('name', data.first_name) 
    && $('#first_name').addClass('error');
    !validateInput('name', data.last_name) 
    && $('#last_name').addClass('error');
    !validateInput('email', data.email) 
    && $('#email').addClass('error');
    !validateInput('company', data.company) 
    && $('#company').addClass('error');
    
    //Submit form if all pass
    (validateInput('name', data.first_name) 
    && validateInput('name', data.last_name) 
    && validateInput('email', data.email) 
    && validateInput('company', data.company))
        && $('#form_submit_button').addClass('activate-loader') 
        && pardotSubmit(data) 
}

var form = document.getElementById('pdf-form');
form.addEventListener('submit', handleSubmit);
