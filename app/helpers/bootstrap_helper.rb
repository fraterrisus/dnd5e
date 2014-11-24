module BootstrapHelper

  def bs_glyph (ident, opts=nil)
    options = merge_options(opts, { class: [ 'glyphicon', "glyphicon-#{ident}" ]}) 
    content_tag(:span, '', options)
  end

  def bs_nav_link (label, url, opts={})
    content_tag(:li, link_to(label, url), opts)
  end

  def bs_nav_divider (opts=nil)
    options = merge_options(opts, { class: 'divider' })
    content_tag(:li, '', options)
  end

  def bs_nav_dropdown (label, &block)
    content_tag(:li, class: 'dropdown') do
      block_text = yield block
      link_label = ''.html_safe
      link_label << label << '&nbsp;'.html_safe << content_tag(:span, '', class: 'caret')
      link_to(link_label, '#', role: 'button', 'data-toggle' => 'dropdown', 'aria-expanded' => false) << block_text
    end
  end

  private

  def merge_options(theirs, yours)
    case theirs
    when NilClass
      return yours
    when Hash
      return theirs.merge(yours) do |key, t, y|
        t = [ t ] unless t.is_a? Array
        y = [ y ] unless y.is_a? Array
        t + y
      end
    else
      fail ArgumentError
    end
  end

end
