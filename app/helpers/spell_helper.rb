module SpellHelper
  def edit_confirm_div
    content_tag(:span, class: 'edit-confirm') do
      bs_glyph('ok', class: %w( btn btn-xs btn-default edit-ok )) <<
      bs_glyph('remove', class: %w( btn btn-xs btn-default edit-nope ))
    end
  end 

  def edit_field_form(object, field_name)
    form_for(object, method: 'patch', html: { 'data-dynamic-object' => 'spell' }) do |f|
      content_tag(:div, class: 'form-group') do
        f.label(field_name) << edit_confirm_div << yield(f)
      end
    end
  end

  def edit_basic_header(object, field_name)
    content_tag(:div, class: 'form-control-static') do
      content_tag(:span, object.send(field_name), 'data-static-attribute' => field_name) <<
      bs_glyph('pencil', id: 'spell_name_edit_icon', 'aria-hidden' => true, class: 'edit-icon')
    end
  end

  def edit_redirect_header(object, field_name, method)
    content_tag(:div, class: %w( form-control-static )) do
      tags = [ ]
      field_name = [ field_name ] unless field_name.is_a? Array
      field_name.each do |fn|
        tags << content_tag(:span, object.send(fn), 'data-static-attribute' => fn,
                            style: 'display: none;', 'aria-hidden' => true)
      end
      tags << content_tag(:span, '', 'data-translate-attribute' => field_name, 
                          'data-translate-method' => method)
      tags << bs_glyph('pencil', id: 'spell_name_edit_icon', 'aria-hidden' => true, class: 'edit-icon')
      safe_join(tags)
    end
  end

  def edit_field_row(widths)
    prefixes = %w( col-xs- col-sm- col-md- col-xl- )
    if widths.nil?
      widths = [ ]
    else
      widths.each_with_index do |w,i|
        widths[i] = "#{prefixes[i]}#{widths[i]}"
      end
    end
    options = { class: 'row' } if widths.any?
    content_tag(:div, options) do
      content_tag(:div, class: (widths << 'edit-fields'), style: 'display: none') do
        yield
      end
    end
  end

  def edit_textfield_row(form_obj, field_name, widths=[])
    edit_field_row(widths) do
      form_obj.text_field(field_name, class: 'form-control', 'data-dynamic-attribute' => field_name)
    end
  end

  def edit_select_row(form_obj, field_name, options, widths=[], dep_tf=nil)
    edit_field_row(widths) do
      html_options = {
        class: %w( form-control ),
        'data-dynamic-attribute' => field_name,
      }
      html_options['data-dependent-textfield'] = dep_tf if dep_tf
      form_obj.select(field_name, options, { }, html_options)
    end
  end

  def edit_checkbox_row(form_obj, field_name, labeltext, widths=[])
    edit_field_row(widths) do
      form_obj.label(field_name, class: 'form-control') do
        form_obj.check_box(field_name, 'data-dynamic-attribute' => field_name) << 
        ' '.html_safe << labeltext
      end
    end
  end

  def edit_textfield_form(object, field_name)
    edit_field_form(object, field_name) do |f|
      edit_basic_header(object, field_name) <<
      edit_textfield_row(f, field_name)
    end
  end

  def edit_select_form(object, field_name, options, translate_method)
    edit_field_form(object, field_name) do |f|
      edit_redirect_header(@spell, field_name, translate_method) <<
      edit_select_row(f, field_name, options, [12,4,3])
    end
  end
end
