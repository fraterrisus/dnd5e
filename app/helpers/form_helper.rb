module FormHelper
  def horiz_form_row(form, attribute, &block)
    content_tag(:div, class: 'form-group') do
      safe_join([
        form.label(attribute, class: %w(col-sm-2 control-label)),
        content_tag(:div, class: 'col-sm-10', &block)
      ])
    end
  end
end
