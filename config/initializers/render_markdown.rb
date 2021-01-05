module MarkdownUtils
  def self.md_to_html (markdown)
    require 'redcarpet'

    md = Redcarpet::Markdown.new(Redcarpet::Render::HTML, tables: true)
    md.render(markdown)
  end
end

ActionController::Renderers.add :md do |str, opts|
  return MarkdownUtils.md_to_html(str)
end
