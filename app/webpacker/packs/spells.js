import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function spellIndexDetail(ev) {
  const $me = ev.currentTarget;
  let filename = $me.getAttribute('data-spell-file');
  fetch('/ajax/spells/detail?name=' + encodeURIComponent(filename))
    .then(Helpers.extractResponseBody)
    .then(ajaxResponseBody => {
      const modalBody = document.querySelector('#detail-body');
      modalBody.innerHTML = ajaxResponseBody;
      const modalTitle = modalBody.querySelector('h1');
      const headerText = modalTitle.innerHTML;
      modalBody.removeChild(modalTitle);
      document.querySelector('#detail-label').innerHTML = headerText;
      new Modal(document.querySelector('#detail-modal')).show();
    })
    .catch(() => {
      document.querySelector('#detail-label').innerHTML = 'Error';
      document.querySelector('#detail-body').innerHTML =
        "<p>There was an error loading that spell's description file.</p>";
      new Modal(document.querySelector('#detail-modal')).show();
    });
}

window.addEventListener('load', () => {
  const button = document.querySelector('#narrowing-ok');
  button.addEventListener('click', () => {
    const pageBody = document.querySelector('#spells-results');
    pageBody.innerHTML = '<h3>Loading...</h3>';
    fetch('ajax/spells/index/' + Helpers.formToQuery('#narrow-select'))
      .then(Helpers.extractResponseBody)
      .then(ajaxResponseBody => {
        pageBody.innerHTML = ajaxResponseBody;
        pageBody.querySelectorAll('.fa-eye')
          .forEach(spellRow => { spellRow.addEventListener('click', spellIndexDetail) });
      })
      .catch(() => {
        pageBody.innerHTML = '<p>There was an error fetching spell data from the server.</p>';
      });
  });
  button.dispatchEvent(new Event('click'));
});
