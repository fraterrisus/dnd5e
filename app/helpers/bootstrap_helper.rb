module BootstrapHelper
  def bs_glyph(ident, opts = {})
    opts[:class] = ['fas', "fa-#{ident}"] + Array.wrap(opts[:class])
    content_tag('span', nil, opts)
  end

  def bs_nav_link(label, url, opts = {})
    tag.li(link_to(label, url), opts)
  end

  def bs_nav_divider(opts = {})
    opts[:class] = ['divider'] + Array.wrap(opts[:class])
    tag(:li, opts)
  end

  def bs_nav_dropdown(label, &block)
    content_tag(:li, class: 'dropdown') do
      block_text = block.call
      link_label = ''.html_safe
      link_label << label << '&nbsp;'.html_safe << content_tag(:span, '', class: 'caret')
      link_to(link_label, '#', role: 'button', 'data-toggle' => 'dropdown', 'aria-expanded' => false) << block_text
    end
  end

  def view_join(*args)
    safe_join(args, '')
  end

  private

  def merge_options(theirs, yours)
    case theirs
    when NilClass
      yours
    when Hash
      theirs.merge(yours) do |_, t, y|
        Array.wrap(t) + Array.wrap(y)
      end
    else
      raise ArgumentError
    end
  end
end
