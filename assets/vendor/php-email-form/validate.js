(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      // Display loading message
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.ok) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset(); // Optionally reset the form
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Form submission failed');
          });
        }
      })
      .catch((error) => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.error-message').innerHTML = error.message;
        thisForm.querySelector('.error-message').classList.add('d-block');
      });
    });
  });

})(); // <-- Make sure this closing bracket is present
