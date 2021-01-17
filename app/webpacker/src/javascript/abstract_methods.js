import {Helpers} from "./ajax_helpers";
import {Modal} from "bootstrap";

export const AbstractMethods = {
  prepareEditForm: function(reloadFunction) {
    return ajaxBody => {
      const myModal = document.getElementById('object-modal');
      myModal.innerHTML = ajaxBody;

      const myForm = document.getElementById('object-form');
      const submitButton = document.getElementById('object-modal-ok');
      submitButton.addEventListener('click', _ =>
        Helpers.submitFormAndReloadPage(myForm, reloadFunction));

      const formInputs = myForm.querySelectorAll('input.form-control');
      myModal.addEventListener('shown.bs.modal', _ => { formInputs[0].focus() });

      new Modal(myModal).show();
    }
  },
};
