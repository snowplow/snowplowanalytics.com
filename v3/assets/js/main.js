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

    var url = $("#main-form").attr("data-pardotUrl");
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
        ? $('.form-wrap').hide() 
            && $('.thankyou').fadeIn(700)
            // push an event to GTM
            && dataLayer.push({ 'event': $("#main-form").attr("data-gtmEventName") })
        : $('input').addClass('error') 
            && $('#form_submit_button').removeClass('activate-loader')
    }
}




// Validate and Submit
var handleSubmit = function(e){
    e.preventDefault();
    var data = {};
    var pass = 1;

    // Default values for form validation
    var fieldsToValidate = ['email','first_name'];

    // Populate DUID
    window.snowplow && window.snowplow(function () {
        data['00N2400000HRtrl'] = this.snplow5.getDomainUserId();
    });

    // Change the validation array if the page is pricing page
    $('#00N2400000JSExF') && ($('#00N2400000JSExF').val() == 'Pricing Page') ? fieldsToValidate = ['email','first_name','last_name','company'] : '';

    $('#main-form input, #main-form textarea').each(function(){
        // Validate input fields
        if(this.name == 'email'){
            !validateInput('email', this.value) && $(this).addClass('error') ? pass = 0 : '';
        }
        if($.inArray(this.name, fieldsToValidate) !== -1){
            !validateInput('not_empty', this.value) && $(this).addClass('error') ? pass = 0 : '';
        }
        // Populate data with input values
        data[this.name] =  this.value;
    });
    // If validation passes - run api call
    pass && $('#form_submit_button').addClass('activate-loader') 
         && pardotSubmit(data)
  
}


// VISUAL HELPERS

//Remove any validation when user tries to rewrite the field
$('input').focus(function(){
    $(this).removeClass('error')
})


// BIND FORM WITH HELPER

var form = document.getElementById('main-form');
form && form.addEventListener('submit', handleSubmit);


// Temp solution - Scroll on writers program TODO

$("#writers-cta").click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#main-form").offset().top -100
    }, 1000);
});

// Pricing page initialize only if present

if($(".pricing-slider")[0]){
    $(".pricing-slider").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 810,
            settings: {
              slidesToShow: 1,
              dots: false,
              initialSlide:1
            }
      
          }]
      });
}



if($(".tools-slider")[0]){
    $(".tools-slider").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        responsive: [
            {
                breakpoint: 1240,
                settings: {
                slidesToShow: 2,
                }
            },
            {
                breakpoint: 810,
                settings: {
                slidesToShow: 3,
                }
            },
            {
                breakpoint: 640,
                settings: {
                slidesToShow: 2,
                }
            },
            {
                breakpoint: 520,
                settings: {
                slidesToShow: 1,
                }
            },
        ]
      });
}


// Small clients wrapper  initialize only if present
// TODO: Convert to ES6 after WP MIG


// First init

function initSmallClientSlider(){
    var sliderProps = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide:1,
        dots: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 940,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 640,
                settings: "unslick"
            }
        ]
    }
    if($(".small-clients-slider")[0]){
        if (window.matchMedia("(max-width: 1375px)").matches) {
            $(".small-clients-slider").slick(sliderProps);
        }else{
            $('.small-clients-slider').slick('unslick');
        }
    }
}


// Handle window resize
$(window).resize(function(){
    initSmallClientSlider();
});
// Handle initial slider activation
$(document).ready(function(){
    initSmallClientSlider();
})


// Pricing page add functionality to hints


$('.questionmark').click(function(e){
    $('.questionmark').next().hide(100);
    $(this).next().show(100);
    e.stopPropagation();
})

$('body').click(function(){
    $('.questionmark').next().hide(100);
});
