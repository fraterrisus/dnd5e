// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require bootstrap-sprockets
//= require bootstrapValidator.min
//= require attribute_translators
//= require spells/index
//= require caster_classes/index
//= require caster_classes/edit
//= require dice/roll

Array.prototype.sortNumbers = function() { 
  return this.sort( function (a,b) { return a-b; } );
}

function submit_form_via_ajax( selector, successMethod, errorMethod ) {
  var $form = $( selector );
  var form_data = $form.serializeArray();
  var post_data = {};
  for (var i=0; i<form_data.length; i++) {
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

