//////////////// jQuery

$(function () {
  // Set form variable
  let form = $("#form");
  // Call below function upon Website loading
  enableFastFeedback(form);

  /// Set status code for each condition: 1: condition met, 0: condition not met
  // Used for submit event, '1' means the condition is met, e.g. name input is valid
  let nameCheck, emailCheck, messageCheck;

  // input values, to be assigned later in submit listener, also used in modal listener
  let name, email, message;

  // Add submit handler to form, only execute when submit button clicked
  $("#form").submit(function (event) {
    // event.preventDefault();
    // Retrieve input values and save to var
    name = $("#name").val();
    email = $("#email").val();
    message = $("#message").val();

    // Somehow calling functions doesnt work, so use manual code below

    // Call validation functions and pass in the submit event object
    // validateNameField(name, event);
    // validateEmailField(email, event);
    // validateMessageField(message, event);

    // if (!isValidName(name)) {
    //   $("#name-feedback").text("Please enter at least two characters");
    //   // form will not submit
    //   // works the same as if preventDefault is in the submit function callback
    //   // If blur event passed in, does nothing below
    //   event.preventDefault();
    // } else {
    //   // If name valid, clear error message (form submits)
    //   $("#name-feedback").text("");
    // }

    // console.log(`before submit: ${nameCheck}, ${emailCheck}, ${messageCheck}`);

    // Set default values to conditions not met
    nameCheck = 0;
    emailCheck = 0;
    messageCheck = 0;

    //////////// Checking Name
    // If name is not valid, print error message, don't submit form
    if (!(name.length >= 2)) {
      // Set status code for condition
      nameCheck = 0;

      $("#name-feedback")
        .text("Please enter at least two characters")
        .slideDown();
      // form will not submit
      // works the same as if preventDefault is in the submit function callback
      // If blur event passed in, does nothing below
      event.preventDefault();
    } else {
      // Set status code for condition
      nameCheck = 1;

      // If name valid, clear error message (form submits)
      $("#name-feedback").text("").slideUp();
    }

    /////////// Checking Email
    // Define condition for email checking
    // Search for latest criteria online
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Boolean variable
    let validEmail = regex.test(email);

    // Check if email valid
    if (!validEmail) {
      // Set status code for condition
      emailCheck = 0;

      $("#email-feedback").text("Please enter a valid email").slideDown();
      event.preventDefault();
    } else {
      // Set status code for condition
      emailCheck = 1;

      $("#email-feedback").text("").slideUp();
    }

    ///////// Checking Message
    if (message.trim() == "") {
      // Set status code for condition
      messageCheck = 0;

      $("#message-feedback").text("Please enter a message").slideDown();
      event.preventDefault();
    } else {
      // Set status code for condition
      messageCheck = 1;

      $("#message-feedback").text("").slideUp();
    }

    // If all conditions are valid, show modal of success submission
    if (nameCheck && emailCheck && messageCheck) {
      // // Code Option 1:
      // Adding attributes so now the submit button will trigger modal
      // $("#submit-button").attr("data-bs-toggle", "modal");
      // $("#submit-button").attr("data-bs-target", "#request-modal");

      // Submit form manually here, otherwise the first press of the button won't trigger the modal
      // $("#submit-button").click();

      // // Code Option 2
      // Manually show the modal
      $("#request-modal").modal("show");

      // Modify below when connecting to actual server
      event.preventDefault();
    }

    // console.log(`after submit: ${nameCheck}, ${emailCheck}, ${messageCheck}`);
  });

  /////// Format reset after modal OK/close button is clicked
  // How to account for clicking on the modal itself - request-modal?
  $("#modal-footer-button").on("click", function () {
    restoreDefaultInputFormat();
  });

  $("#request-modal").on("click", function () {
    restoreDefaultInputFormat();
  });

  //// Fading on scroll
  // Create a 'fadein' class, whichever element adds this class will fadein upon scrolling to it
  $(window).scroll(function () {
    $(".fadein").each(function (i) {
      // let bottomOfElement = $(this).offset().top + $(this).outerHeight();
      let bottomOfElement = $(this).offset().top;

      // let bottomOfWindow = $(window).scrollTop() + $(window).height();
      let bottomOfWindow = $(window).scrollTop() + $(window).height() / 1.2;

      // console.log(bottomOfElement, bottomOfWindow);

      if (bottomOfWindow > bottomOfElement) {
        $(this).animate({ opacity: "1" }, 900);
      }
    });
  });

  ////////////// Collapse Navbar upon clicking for mobile button

  // Solution 1
  let navMain = $(".navbar-collapse");

  navMain.on("click", "a", null, function () {
    navMain.collapse("hide");
  });

  // Solution 2
  // $(document).on("click", ".navbar-toggleable-xs.in", function (e) {
  //   if ($(e.target).is("a")) {
  //     $(this).collapse("hide");
  //   }
  // });

  // Solution 3
  // $(document).on("click", ".navbar-collapse.in", function (e) {
  //   if ($(e.target).is("a")) {
  //     $(this).collapse("hide");
  //   }
  // });

  // Solution 4
  // NOTE: Need to Add js-scroll-trigger class to each nav-item on each page for below code to work
  // $(".js-scroll-trigger").click(function () {
  //   $(".navbar-collapse").collapse("hide");
  // });

  ////////////// Make sure smooth scrolling takes out the navbar's height
  $("html,body").animate(
    {
      scrollTop: target.offset().top - $(".navbar").height() - 50,
    },
    1000
  );
});

//////////////////////////////////
////////Functions in global scope
//////////////////////////////////

// Fast feedback functions
function enableFastFeedback(formElement) {
  // Save input elements into var
  let nameInput = formElement.find("#name");
  let emailInput = formElement.find("#email");
  let messageInput = formElement.find("#message");
  //   let passwordInput = formElement.find("#password");

  // Add blur event handler on input field
  nameInput.blur(function (event) {
    let name = $(this).val();
    // blur event gets passed in below
    // Either prints error message or delete error message
    validateNameField(name, event);

    // Add red shadow if input not valid; green otherwise
    if (!isValidName(name)) {
      $(this).css({ "box-shadow": "0 0 4px red", border: "1px solid red" });
    } else {
      $(this).css({ "box-shadow": "0 0 4px green", border: "1px solid green" });
    }
  });

  emailInput.blur(function (event) {
    let email = $(this).val();
    validateEmailField(email, event);

    // Add red shadow if input not valid; green otherwise
    if (!isValidEmail(email)) {
      $(this).css({ "box-shadow": "0 0 4px red", border: "1px solid red" });
    } else {
      $(this).css({ "box-shadow": "0 0 4px green", border: "1px solid green" });
    }
  });

  messageInput.blur(function (event) {
    let message = $(this).val();
    validateMessageField(message, event);

    // Add red shadow if input not valid; green otherwise
    if (!isValidMessage(message)) {
      $(this).css({ "box-shadow": "0 0 4px red", border: "1px solid red" });
    } else {
      $(this).css({ "box-shadow": "0 0 4px green", border: "1px solid green" });
    }
  });

  ///////////////////////
  // Validate name field with the form submit event passed in
  function validateNameField(name, event) {
    // If name is not valid, print error message, don't submit form
    if (!isValidName(name)) {
      $("#name-feedback")
        .text("Please enter at least two characters")
        .slideDown();
      // form will not submit
      // works the same as if preventDefault is in the submit function callback
      // If blur event passed in, does nothing below
      event.preventDefault();
    } else {
      // If name valid, clear error message (form submits)
      $("#name-feedback").text("").slideUp();
    }
  }

  // Returns true is name is valid, otherwise return false
  function isValidName(name) {
    return name.length >= 2;
  }

  // Validate email field with the form submit event passed in
  function validateEmailField(email, event) {
    if (!isValidEmail(email)) {
      $("#email-feedback").text("Please enter a valid email").slideDown();
      event.preventDefault();
    } else {
      $("#email-feedback").text("").slideUp();
    }
  }

  // Returns true if email is valid, otherwise return false
  function isValidEmail(email) {
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  // Validate message field with the form submit event passed in
  function validateMessageField(message, event) {
    if (!isValidMessage(message)) {
      $("#message-feedback").text("Please enter a message").slideDown();
      event.preventDefault();
    } else {
      $("#message-feedback").text("").slideUp();
    }
  }

  // Returns true if there is message, otherwise return false
  function isValidMessage(message) {
    return !(message.trim() == "");
  }
}

// Function call to restore the default input formats upon closing of modal
function restoreDefaultInputFormat() {
  // Remove attributes on the submit button so when clicking on submit button again with data not meeting the input conditions, it won't submit
  // Essentially return to default state before the submit button is clicked
  $("#submit-button").removeAttr("data-bs-toggle");
  $("#submit-button").removeAttr("data-bs-target");

  // Set inputs back to null
  $("#name").val("");
  $("#email").val("");
  $("#message").val("");

  // Change input formats to default
  $("#name").css("box-shadow", "initial");
  $("#name").css("border", "1px solid #dee2e6");
  $("#email").css("box-shadow", "initial");
  $("#email").css("border", "1px solid #dee2e6");
  $("#message").css("box-shadow", "initial");
  $("#message").css("border", "1px solid #dee2e6");
}

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions

/* Since some Safari browsers don't support gap property for flexbox, we have to manually add the gap properties to the flexboxes in CSS */
/* Below code when executed, will add the 'no-flexbox-gap' class to body, thus triggering the 'no-flexbox-gap' class related formats to apply (all flex gap related) */

// function checkFlexGap() {
//   var flex = document.createElement("div");
//   flex.style.display = "flex";
//   flex.style.flexDirection = "column";
//   flex.style.rowGap = "1px";

//   flex.appendChild(document.createElement("div"));
//   flex.appendChild(document.createElement("div"));

//   document.body.appendChild(flex);
//   var isSupported = flex.scrollHeight === 1;
//   flex.parentNode.removeChild(flex);
//   // console.log(isSupported);

//   // If browser doesn't support, add below class to body
//   if (!isSupported) document.body.classList.add("no-flexbox-gap");
// }
// checkFlexGap();
