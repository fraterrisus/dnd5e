import {Toast} from "bootstrap";

export const Toasts = {
  showToastWithBody: function(header, body, color='warning') {
    const toastElement = document.createElement('DIV');
    toastElement.setAttribute('class', 'toast');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('data-bs-autohide', 'false');
    toastElement.setAttribute('role', 'alert');

    const toastHeader = document.createElement('DIV');
    toastHeader.setAttribute('class', 'toast-header');

    const toastHeaderIcon = document.createElement('I');
    toastHeaderIcon.setAttribute('class', `rounded me-2 bi bi-square-fill text-${color}`);

    const toastHeaderText = document.createElement('STRONG');
    toastHeaderText.setAttribute('class', 'me-auto');
    toastHeaderText.appendChild(document.createTextNode(header));

    const toastHeaderWhen = document.createElement('SMALL');
    toastHeaderWhen.setAttribute('class', 'text-muted');
    toastHeaderWhen.appendChild(document.createTextNode(new Date().toTimeString().slice(0,8)));

    const toastCloseButton = document.createElement('BUTTON');
    toastCloseButton.setAttribute('class', 'btn-close');
    toastCloseButton.setAttribute('aria-label', 'close');
    toastCloseButton.setAttribute('data-bs-dismiss', 'toast');
    toastCloseButton.setAttribute('type', 'button');

    toastHeader.appendChild(toastHeaderIcon);
    toastHeader.appendChild(toastHeaderText);
    toastHeader.appendChild(toastHeaderWhen);
    toastHeader.appendChild(toastCloseButton);

    const toastBody = document.createElement('DIV');
    toastBody.setAttribute('class', 'toast-body');
    toastBody.appendChild(body);

    toastElement.appendChild(toastHeader);
    toastElement.appendChild(toastBody);

    document.getElementById('toasts').appendChild(toastElement);
    new Toast(toastElement).show();
  },

  showToastWithText: function(header, message, color='warning') {
    const body = document.createTextNode(message);
    this.showToastWithBody(header, body, color)
  }
}
