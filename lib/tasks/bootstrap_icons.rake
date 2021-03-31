namespace :bootstrap do
  desc 'Import bootstrap-icons SCSS and update font URLs'
  task :icons do
    source_dir = Rails.root.join('node_modules', 'bootstrap-icons', 'font')
    assets_dir = Rails.root.join('app', 'webpacker', 'stylesheets')

    css_source = "#{source_dir}/bootstrap-icons.css"
    scss_dest = "#{assets_dir}/bootstrap-icons.scss"
    puts "Processing #{css_source}\ninto #{scss_dest}..."

    font_regexp = Regexp.new('url\("\.\/(fonts\/.*)\?[a-f0-9]+\"\)')
    lines = File.readlines(css_source)
    File.open(scss_dest, 'w') do |ofile|
      lines.each do |line|
        matchdata = line.match(font_regexp)
        if matchdata
          new_filename = "~bootstrap-icons/font/#{matchdata[1]}"
          line = "#{matchdata.pre_match}url(\"#{new_filename}\")#{matchdata.post_match}"
        end
        ofile.puts line
      end
    end
    puts 'Done'
  end
end

require 'rails/tasks'

Rake::Task['yarn:install'].enhance(nil) { Rake::Task['bootstrap:icons'].invoke }
