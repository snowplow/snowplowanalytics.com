$(function() {

	// hide previous error messages

	$('.error').hide();
	$('.help-inline').hide();
	$('.request-trial-group').removeClass("error");

	function isEmail(email) { // http://stackoverflow.com/questions/2507030/email-validation-using-jquery
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}

	$('#submitRequestTrial').click(function() {

		// hide previous error messages

		$('.help-inline').hide();
		$('.request-trial-group').removeClass("error");

		// fetch inputs for Snowplow

		var leadSource = document.getElementById("inputLeadSource").value;
		var firstName = document.getElementById("inputFirstName").value;
		var lastName = document.getElementById("inputLastName").value;
		var email = document.getElementById("inputEmail").value;
		var phone = document.getElementById("inputPhone").value;
		var company = document.getElementById("inputCompany").value;
		var insights = document.getElementById('inputLeadInsights').checked ? true : false;
		var react = document.getElementById('inputLeadReact').checked ? true : false;

		// create context JSON. This is the variable that we push to the dataLayer

		var submission = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phone: phone,
			company: company,
			insights: insights,
			react: react
		};

		// validate inputs

		if (firstName == "") {
			$('#groupFirstName').addClass("error"); // add class 'error' to #groupFirstName
			$('#controlsFirstName').append('<div class="help-inline">Please enter a first name.</div>'); // add this div after the #controlsFirstName element
			return false;
		}

		if (lastName == "") {
			$('#groupLastName').addClass("error"); // add class 'error' to #groupLastName
			$('#controlsLastName').append('<div class="help-inline">Please enter a last name.</div>'); // add this div after the #controlsLastName element
			return false;
		}

		if (email == "") {
			$('#groupEmail').addClass("error"); // add class 'error' to #groupEmail
			$('#controlsEmail').append('<div class="help-inline">Please enter an email address.</div>'); // add this div after the #controlsEmail element
			return false;
		}

		if (!isEmail(email)) {
			$('#groupEmail').addClass("error"); // add class 'error' to #groupEmail
			$('#controlsEmail').append('<div class="help-inline">Please enter a valid email address.</div>'); // add this div after the #controlsEmail element
			return false;
		}

		if (company == "") {
			$('#groupCompany').addClass("error"); // add class 'error' to #groupCompany
			$('#controlsCompany').append('<div class="help-inline">Please enter a company name.</div>'); // add this div after the #controlsCompany element
			return false;
		}

		// if (leadSource == "") {
		//	$('#groupLeadSource').addClass("error"); // add class 'error' to #groupLeadSource
		//	$('#controlsLeadSource').append('<div class="help-inline">Please choose a product.</div>'); // add this div after the #controlsLeadSoure element
		//	return false;
		// } This is pre-set so it can never be null

		if ((insights = false) && (react = false)) { // CAN'T GET THIS TO WORK!!!
			$('#groupLeadSource').addClass("error"); // add class 'error' to #groupLeadSource
			$('#controlsLeadInsights').append('<div class="help-inline">Please choose a product.</div>'); // add this div after the #controlsLeadInsights element
			return false;
		}

	// submit form to dataLayer

		dataLayer.push({
			'event': 'demo_request',
			'submission': submission
		});

		if (leadSource != "") {

			var form = document.getElementById("requestTrial");

			var elementOID = document.createElement("input");
			elementOID.name = "oid";
			elementOID.value = "00D24000000bPI5";
			elementOID.setAttribute("type", "hidden");
			form.appendChild(elementOID);

			var elementRetURL = document.createElement("input");
			elementRetURL.name = "retURL";
			elementRetURL.value = "https://snowplowanalytics.com/request-demo/thanks";
			elementRetURL.setAttribute("type", "hidden");
			form.appendChild(elementRetURL);

			var elementSC1 = document.createElement("input");
			elementSC1.name = "00N2400000HS40P";
			elementSC1.value = 42;
			elementSC1.setAttribute("type", "hidden");
			form.appendChild(elementSC1);

			snowplow(function () { // add duid

				var snplow5 = this.snplow5;
				var domainUserId = snplow5.getDomainUserId();

				var elementDUID = document.createElement("input");
				elementDUID.name = "00N2400000HRtrl";
				elementDUID.value = domainUserId;
				elementDUID.setAttribute("type", "hidden");
				form.appendChild(elementDUID);

			})

			document.getElementById("inputWebsite").setAttribute("name","00N2400000HS6sg");
			document.getElementById("inputFirstName").setAttribute("name","first_name");
			document.getElementById("inputLastName").setAttribute("name","last_name");
			document.getElementById("inputEmail").setAttribute("name","email");
			document.getElementById("inputCompany").setAttribute("name","company");
			document.getElementById("inputPhone").setAttribute("name", "phone");
			document.getElementById("inputLeadSource").setAttribute("name","lead_source");

			form.method = "POST";
			form.action = "https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
			form.submit();

			// do not reload page

		}

		return false;

	});

});
