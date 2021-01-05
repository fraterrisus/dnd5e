export const Helpers = {
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
    let selected = [];
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeName === type) {
        selected.push(children[i]);
      }
    }
    return selected;
  },

  submitFormAndReloadPage: function (formElement, reloadCallback) {
    fetch(formElement.getAttribute('action'), {
      method: formElement.getAttribute('method'),
      body: new FormData(formElement)
    }).then(response => {
      reloadCallback();
      if (!response.ok) {
        alert("Error: Unable to submit form");
      }
    });
  }
    // JSON.stringify({ object: data });
    // JSON.stringify(Object.fromEntries(new FormData(form)));
};

