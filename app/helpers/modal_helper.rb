module ModalHelper
  def bootstrap_modal(id, klass, title, options = { })
    options[:submit_label] ||= 'OK'
    options[:inline] ||= false
    options[:form] ||= { }
    options[:form][:role] = 'form'
    options[:form][:id] = "#{id}-form"
    options[:form][:class] = (options[:inline] ? 'form-inline' : 'form') 

    content_tag(:div, id: "#{id}-modal", class: 'modal fade', 
                tabindex: '-1', role: 'dialog', 'aria-hidden' => true,
                'aria-labelledby' => "#{id}-label") do
      content_tag(:div, class: %w( modal-dialog )) do
        form_for(klass.new, { html: options[:form] }) do |f|
          content_tag(:div, class: %w( modal-content )) do
            content_tag(:div, class: %w( modal-header )) do
              button_tag('type' => 'button', 'data-dismiss' => 'modal', class: %w( close )) do
                content_tag(:span, nil, class: %w( fa fa-close ), 'aria-hidden' => true) <<
                content_tag(:span, 'close', class: 'sr-only')
              end <<
              content_tag(:h4, title, id: "#{id}-label", class: 'modal-title')
            end <<
            content_tag(:div, class: %w( modal-body )) { yield(f) } <<
            content_tag(:div, class: %w( modal-footer )) do
              button_tag('Cancel', type: 'button', 
                         class: %w( btn btn-default ), 'data-dismiss' => 'modal') <<
              button_tag(options[:submit_label], type: 'submit', 
                         id: "#{id}-ok", class: %w( btn btn-primary ))
            end
          end
        end
      end
    end
  end 
end
