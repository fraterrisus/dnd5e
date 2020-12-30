import Rails from "@rails/ujs";

export const Helpers = {
    submit_form_via_ajax: function(selector, successMethod, errorMethod) {
        let $form = $( selector );
        let form_data = $form.serializeArray();
        let post_data = {};
        for (let i=0; i<form_data.length; i++) {
            post_data[ form_data[i].name ] = form_data[i].value;
        }
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            dataType: 'json',
            data: post_data,
            success: successMethod,
            error: errorMethod,
        });
    }
};

