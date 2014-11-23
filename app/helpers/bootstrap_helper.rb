module BootstrapHelper
  def bs_icon (ident)
    content_tag(:span, '', class: ident)
  end

  def bs_glyph (ident)
    
    content_tag(:span, '', class: [ 'glyphicon', "glyphicon-#{ident}" ])
  end

  def bs_nav_link (label, url)
    content_tag(:li, link_to(label, url))
  end

  def bs_nav_divider
    content_tag(:li, '', class: 'divider')
  end

  def bs_nav_dropdown (label, &block)
    content_tag(:li, class: 'dropdown') do
      block_text = yield block
      link_label = ''.html_safe
      link_label << label << '&nbsp;'.html_safe << bs_icon('caret')
      link_to(link_label, '#', role: 'button', 'data-toggle' => 'dropdown', 'aria-expanded' => false) << block_text
    end
  end
end
