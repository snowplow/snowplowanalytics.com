$(function() {

  // hide previous error messages

  $('.error').hide();
  $('.help-inline').hide();
  $('.main-form-group').removeClass("error");

  function isEmail(email) { // http://stackoverflow.com/questions/2507030/email-validation-using-jquery
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  $('#submitContactUs').click(function() {

    // hide previous error messages

    $('.help-inline').hide();
    $('.main-form-group').removeClass("error");

    // fetch inputs for Snowplow

    var leadSource = document.getElementById("inputLeadSource").value;
    var leadSourceWebsite = document.getElementById("inputLeadSourceWebsite").value;
    var firstName = document.getElementById("inputFirstName").value;
    var lastName = document.getElementById("inputLastName").value;
    var email = document.getElementById("inputEmail").value;
    var phone = document.getElementById("inputPhone").value;
    var company = document.getElementById("inputCompany").value;
    var subject = document.getElementById("inputSubject").value;
    var message = document.getElementById("inputMessage").value;

    // create context JSON. This is the variable that we push to the dataLayer

    var submission = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      company: company,
      subject: subject,
      message: message
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

    if (message == "") {
      $('#groupMessage').addClass("error"); // add class 'error' to #groupCompany
      $('#controlsMessage').append('<div class="help-inline">Please enter a message.</div>'); // add this div after the #controlsMessage element
      return false;
    }

    // submit form to datalayer

    dataLayer.push({
      'event': 'contact',
      'submission': submission
    });

    if (leadSource == "Website" && leadSourceWebsite == "Contact Form") {

      // add various inputs

      var form = document.getElementById("contactUs");

      var elementOID = document.createElement("input");
      elementOID.name = "oid";
      elementOID.value = "00D24000000bPI5";
      elementOID.setAttribute("type", "hidden");
      form.appendChild(elementOID);

      var elementRetURL = document.createElement("input");
      elementRetURL.name = "retURL";
      elementRetURL.value = "https://snowplowanalytics.com/company/contact-us/thank-you";
      elementRetURL.setAttribute("type", "hidden");
      form.appendChild(elementRetURL);

      var elementSC1 = document.createElement("input");
      elementSC1.name = "00N2400000HS40P";
      elementSC1.value = 42;
      elementSC1.setAttribute("type", "hidden");
      form.appendChild(elementSC1);


      try {
        snowplow(function () {
          var elementDUID = document.createElement("input");
          elementDUID.name = "00N2400000HRtrl";
          elementDUID.value = this.snplow5.getDomainUserId();
          elementDUID.setAttribute("type", "hidden");
          form.appendChild(elementDUID);
        })
      }
      catch (e) {}

      document.getElementById("inputLeadSource").setAttribute("name","lead_source");
      document.getElementById("inputLeadSourceWebsite").setAttribute("name","00N2400000JSExF");
      document.getElementById("inputWebsite").setAttribute("name","00N2400000HS6sg");
      document.getElementById("inputFirstName").setAttribute("name","first_name");
      document.getElementById("inputLastName").setAttribute("name","last_name");
      document.getElementById("inputEmail").setAttribute("name","email");
      document.getElementById("inputCompany").setAttribute("name","company");
      document.getElementById("inputMessage").setAttribute("name","00N2400000HU7tD");

      form.method = "POST";
      form.action = "http://go.snowplowanalytics.com/l/571483/2018-07-31/32ysw6v";
      form.submit();

    }

    // do not reload page

    return false;

  });

});
