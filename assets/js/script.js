'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (!modalContainer || !overlay) return;
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items (only if testimonials exist on the page)
if (testimonialsItem && testimonialsItem.length) {
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      // Protect against missing nested elements
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt;
      }

      if (modalTitle && title) modalTitle.innerHTML = title.innerHTML;
      if (modalText && text) modalText.innerHTML = text.innerHTML;

      testimonialsModalFunc();

    });

  }
}

// add click event to modal close button and overlay only if they exist
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const clickedLabel = this.textContent.trim().toLowerCase();

    for (let j = 0; j < pages.length; j++) {
      if (clickedLabel === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        if (navigationLinks[j]) navigationLinks[j].classList.remove("active");
      }
    }

  });
}

// form submit handler: supports Formspree if 'action' is configured, otherwise fall back to mailto
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('[data-form-btn]');
    const submitText = submitBtn ? submitBtn.innerHTML : null;

    const formData = new FormData(form);
    const dataObj = {};
    formData.forEach((v, k) => dataObj[k] = v);

    // Visual feedback
    if (submitBtn) {
      submitBtn.setAttribute('disabled', '');
      submitBtn.innerHTML = '<span>Sending...</span>';
    }

    // If action is configured and not '#', send via fetch (e.g., Formspree)
    const actionUrl = form.getAttribute('action');
    if (actionUrl && actionUrl !== '#' && actionUrl.indexOf('formspree.io') > -1) {
      fetch(actionUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(function (response) {
        if (response.ok) {
          alert('Thank you! Your message has been sent.');
          form.reset();
        } else {
          response.json().then(function (data) {
            alert('Oops! There was a problem.');
          });
        }
      }).catch(function (err) {
        console.error(err);
        alert('Oops! There was a problem sending your message.');
      }).finally(function () {
        if (submitBtn) {
          submitBtn.removeAttribute('disabled');
          submitBtn.innerHTML = submitText;
        }
      });
    } else {
      // fallback: open mailto link with form data (requires user's email client)
      const subject = encodeURIComponent('Portfolio Contact from ' + (dataObj.fullname || 'Website'));
      const body = encodeURIComponent('Name: ' + (dataObj.fullname || '') + '\nEmail: ' + (dataObj.email || '') + '\n\n' + (dataObj.message || ''));
      const mailtoLink = 'mailto:work.carljudeutrera@gmail.com?subject=' + subject + '&body=' + body;
      window.location.href = mailtoLink;
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.innerHTML = submitText;
      }
    }

  });
}