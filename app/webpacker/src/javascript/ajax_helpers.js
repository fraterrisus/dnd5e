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

    submit_form_via_ajax: function(selector, successMethod, errorMethod) {
        let $form = $( selector );
        let form_data = $form.serializeArray();
        let post_data = {};
        for (let i=0; i<form_data.length; i++) {
            post_data[ form_data[i].name ] = form_data[i].value;
        }
        // JSON.stringify({ object: data });
        // JSON.stringify(Object.fromEntries(new FormData(form)));
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            dataType: 'json',
            data: post_data,
            success: successMethod,
            error: errorMethod,
        });
    },
};

