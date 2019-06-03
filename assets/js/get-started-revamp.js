/**
 * Vars
 */

/**
 * Ready
 */
 $(document).ready(function() {
 	
 	$('.get-started-form-wrapper-front').click(function(event) {
 		$('.get-started-form-wrapper').removeClass('open');
 		var parent = $(this).parent('.get-started-form-wrapper');
 		$(parent).addClass('open');

 	});

 	/**
	 * Fake dropdown - Handle filters in case studies blocks
	*/
	$('.fake-dropdown').each(function(index, el) {
		var cust_rev_fake_drop = $(this);
		var cust_rev_opt = cust_rev_fake_drop.find('ul li');
		var cust_rev_label = cust_rev_fake_drop.find('label');
		var cust_rev_ipt = cust_rev_fake_drop.find('input[type=checkbox]');
		//Change dropdwon value
		cust_rev_opt.click(function(event) {
			cust_rev_fake_drop.attr( 'data-value', $(this).attr('data-value') );
			cust_rev_label.html( $(this).html() );
			cust_rev_ipt.prop('checked', false);
			/**/
			var count = 0;
	 		var option = $(this).attr('data-value');
	 		if ( option == 0 ) {
	 			
	 		} else {
	 			
	 		}
			/**/
		});
		//close it on hover out
		$(this).hover(function() {
			//do nothing
		}, function() {
			cust_rev_ipt.prop('checked', false);
		});
	});


	/**
	 * Form get-started-sales submition
	*/
	// Hide help messages on loading
	$('.help-inline').hide();
	// Handle submission
	$('#sales-submit').click(function(event) {
		event.preventDefault();

		// Validation
		$('.help-inline').hide();
    	$(this).removeClass("error");
    	var error_count = 0;

    	// First name
    	var first_name = $('#sales-first-name').val(); console.log('first_name', first_name);
    	if (first_name.length == 0) {
    		$('#sales-first-name').next('.help-inline').html('Please enter a first name.').show();
    		error_count++;
    	} //else $('#sales-first-name').next('.help-inline').hide();

    	// Last name
    	var last_name = $('#sales-last-name').val(); console.log('last_name', last_name);
    	if (last_name.length == 0) {
    		$('#sales-last-name').next('.help-inline').html('Please enter a last name.').show();
    		error_count++;
    	} //else $('#sales-last-name').next('.help-inline').hide();

    	// Work email
    	var email = $('#sales-work-email').val(); console.log('email', email);
    	if (email.length == 0) {
    		$('#sales-work-email').next('.help-inline').html('Please enter an email address.').show();
    		error_count++;
    	} else if( !isEmail(email) ) {
    		$('#sales-work-email').next('.help-inline').html('Please enter a valid email address.').show();
    		error_count++;
    	} //else $('#sales-work-email').next('.help-inline').hide();

    	// Company
    	var company = $('#sales-company').val(); console.log('company', company);
    	if (company.length == 0) {
    		$('#sales-company').next('.help-inline').html('Please enter a company name.').show();
    		error_count++;
    	} //else $('#sales-company').next('.help-inline').hide();

    	// Type (no validation)
    	var type = $('#sales-type').parent('.fake-dropdown').attr('data-value'); console.log('type', type);

    	// Message (no validation)
    	var message = $('#sales-message').val(); console.log('message', message);

    	// Submit if there's no errors
    	if ( error_count == 0) {
    		// push to GTM
		    dataLayer.push({
		      'event': 'demo_request',
		      'submission': {
		        firstName: first_name,
		        lastName: last_name,
		        email: email,
		        //phone: phone,
		        company: company,
		        insights: false,
		        react: false
		      }
		    });
		    // submit to SF
		    var form = $('#get-started-sales');

		    var elementOID = document.createElement("input");
		    elementOID.name = "oid";
		    elementOID.value = "00D24000000bPI5";
		    elementOID.setAttribute("type", "hidden");
		    form.append(elementOID);

		    var elementRetURL = document.createElement("input");
		    elementRetURL.name = "retURL";
		    elementRetURL.value = "https://snowplowanalytics.com/get-started/thank-you";
		    elementRetURL.setAttribute("type", "hidden");
		    form.append(elementRetURL);

		    var elementSC1 = document.createElement("input");
		    elementSC1.name = "00N2400000HS40P";
		    elementSC1.value = 42;
		    elementSC1.setAttribute("type", "hidden");
		    form.append(elementSC1);

		    try {
		        snowplow(function () {
			        var elementDUID = document.createElement("input");
			        elementDUID.name = "00N2400000HRtrl";
			        elementDUID.value = this.snplow5.getDomainUserId();
			        elementDUID.setAttribute("type", "hidden");
			        form.append(elementDUID);
		        })
		    }
		    catch (e) {
		    	console.log(e);
		    }

      		// document.getElementById("inputLeadSource").setAttribute("name","lead_source");
      		// document.getElementById("inputLeadSourceWebsite").setAttribute("name","00N2400000JSExF");
      		// document.getElementById("inputWebsite").setAttribute("name","00N2400000HS6sg");
      		document.getElementById("sales-first-name").setAttribute("name","first_name");
      		document.getElementById("sales-last-name").setAttribute("name","last_name");
      		document.getElementById("sales-work-email").setAttribute("name","email");
      		document.getElementById("sales-company").setAttribute("name","company");
      		// document.getElementById("inputPhone").setAttribute("name", "phone");

      		form.method = "POST";
      		form.action = "http://go.snowplowanalytics.com/l/571483/2018-07-24/32cpsvj";
      		form.submit();
    	}
	});


	/**
	 * Form find out more submition
	*/
	// Hide help messages on loading
	$('.help-inline').hide();
	// Handle submission
	$('#more-submit').click(function(event) {
		event.preventDefault();

		// Validation
		$('.help-inline').hide();
    	$(this).removeClass("error");
    	var error_count = 0;

    	// First name
    	var first_name = $('#more-first-name').val(); console.log('first_name', first_name);
    	if (first_name.length == 0) {
    		$('#more-first-name').next('.help-inline').html('Please enter a first name.').show();
    		error_count++;
    	} 

    	// Last name
    	var last_name = $('#more-last-name').val(); console.log('last_name', last_name);
    	if (last_name.length == 0) {
    		$('#more-last-name').next('.help-inline').html('Please enter a last name.').show();
    		error_count++;
    	} 

    	// Work email
    	var email = $('#more-work-email').val(); console.log('email', email);
    	if (email.length == 0) {
    		$('#more-work-email').next('.help-inline').html('Please enter an email address.').show();
    		error_count++;
    	} else if( !isEmail(email) ) {
    		$('#more-work-email').next('.help-inline').html('Please enter a valid email address.').show();
    		error_count++;
    	} 

    	// Company
    	var company = $('#more-company').val(); console.log('company', company);
    	if (company.length == 0) {
    		$('#more-company').next('.help-inline').html('Please enter a company name.').show();
    		error_count++;
    	} 

    	// Type (no validation)
    	var type = $('#more-type').parent('.fake-dropdown').attr('data-value'); console.log('type', type);

    	// Submit if there's no errors
    	if ( error_count == 0) {
    		
		    // submit to SF
		    var form = $('#get-started-more');

		    var elementOID = document.createElement("input");
		    elementOID.name = "oid";
		    elementOID.value = "00D24000000bPI5";
		    elementOID.setAttribute("type", "hidden");
		    form.append(elementOID);

		    var elementRetURL = document.createElement("input");
		    elementRetURL.name = "retURL";
		    elementRetURL.value = "https://snowplowanalytics.com/request-demo/thank-you";
		    elementRetURL.setAttribute("type", "hidden");
		    form.append(elementRetURL);

		    var elementSC1 = document.createElement("input");
		    elementSC1.name = "00N2400000HS40P";
		    elementSC1.value = 42;
		    elementSC1.setAttribute("type", "hidden");
		    form.append(elementSC1);

		    try {
		        snowplow(function () {
			        var elementDUID = document.createElement("input");
			        elementDUID.name = "00N2400000HRtrl";
			        elementDUID.value = this.snplow5.getDomainUserId();
			        elementDUID.setAttribute("type", "hidden");
			        form.append(elementDUID);
		        })
		    }
		    catch (e) {
		    	console.log(e);
		    }

      		// document.getElementById("inputLeadSource").setAttribute("name","lead_source");
      		// document.getElementById("inputLeadSourceWebsite").setAttribute("name","00N2400000JSExF");
      		// document.getElementById("inputWebsite").setAttribute("name","00N2400000HS6sg");
      		document.getElementById("sales-first-name").setAttribute("name","first_name");
      		document.getElementById("sales-last-name").setAttribute("name","last_name");
      		document.getElementById("sales-work-email").setAttribute("name","email");
      		document.getElementById("sales-company").setAttribute("name","company");
      		// document.getElementById("inputPhone").setAttribute("name", "phone");

      		form.method = "POST";
      		form.action = "https://go.snowplowanalytics.com/l/571483/2019-05-20/3q8c5vs";
      		form.submit();
    	}
	});

 });


 function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }