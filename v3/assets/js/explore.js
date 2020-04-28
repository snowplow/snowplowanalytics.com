

// Add tooltip to table td
$(function () {
    $('table td').tooltip({
        placement: "top",
        container: 'body',
        delay: { "show": 30, "hide": 10 }   
    })
})


// Toggle the raw-data table in explore-snowplow-data-part-2 page
$('#raw-set-data-toggle').click(function(){
    $('#raw-set-data').slideToggle();
})

// Toggle submit form in explore-snowplow-data-part-1 page
var isProductFormToggled = 0
$('#product-form-toggle').click(function(){
    isProductFormToggled = 1;

    if(isProductFormToggled){
        $('#product-form').slideToggle();
        setTimeout(function(){ 
            console.log('vo timeout')
            $('html, body').animate({
                scrollTop: ($('#product-form-toggle').offset().top -200)
            },500);
         }, 300);
    }else{
        console.log('veke kliknato')
        $('#product-form').slideToggle();
    }
});



// Add top horizontal bar to raw data table. 
// Get width of the raw table and apply it to the empty div with scrollbar


var tableSize = $('.raw-data-css table').width();
$('.top-scrollbar').width(tableSize);


// Bind the wrapper scrolls

$(function(){
    $(".top-scroller-target").scroll(function(){
        $(".raw-data-css")
            .scrollLeft($(".top-scroller-target").scrollLeft());
    });
    $(".raw-data-css").scroll(function(){
        $(".top-scroller-target")
            .scrollLeft($(".raw-data-css").scrollLeft());
    });
});