import {Toasts} from "./toasts";

export const Helpers = {
  disableUI: function() {
    document.getElementById('page-spinner').classList.remove('d-none');

    for (let button of document.querySelectorAll('.card-header .btn'))
      button.setAttribute('disabled', 'true');
  },

  enableUI: function() {
    document.getElementById('page-spinner').classList.add('d-none');

    for (let button of document.querySelectorAll('.card-header .btn'))
      button.removeAttribute('disabled');
  },

  extractResponseBody: function(response) {
    if (response.ok) {
      return response.text();
    } else {
      return Promise.reject(response);
    }
  },

  extractResponseJson: function(response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  },

  formToQuery: function(selector) {
    const element = document.querySelector(selector);
    const formData = new FormData(element);
    let parameters = [];
    formData.forEach(function(value, key) {
      parameters.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    })
    return "?" + parameters.join("&");
  },

  getChildrenOfElement: function (element, type) {
    const children = element.childNodes;
    const match = type.toUpperCase();
    let selected = [];
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeName === match) {
        selected.push(children[i]);
      }
    }
    return selected;
  },

  submitFormAndReloadPage: function (formElement, reloadCallback) {
    Helpers.disableUI();
    fetch(formElement.getAttribute('action'), {
      method: formElement.getAttribute('method'),
      body: new FormData(formElement)
    }).then(response => {
      reloadCallback(); // expected to call enableUI()
      if (!response.ok) {
        Toasts.showToastWithText('Server Error', 'Unable to submit form.', 'danger');
      }
    });
  }
};

