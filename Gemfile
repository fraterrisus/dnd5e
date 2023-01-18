source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.2'

gem 'rubyzip', '~> 2.3' # be intentional about the upgrade to 3.0

gem 'bootsnap', '>= 1.4', require: false # boot caching, see config/boot.rb
gem 'jbuilder', '~> 2.7'
gem 'puma', '~> 5.6'
gem 'rails', '~> 6.1'
gem 'redcarpet', '~> 3.5' # allows rendering Markdown
gem 'rubocop-rails', '~> 2.9'
gem 'sass-rails', '>= 6'
gem 'sqlite3', '~> 1.4'
gem 'webpacker', '~> 5.0'

# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw] # similar to 'pry', call 'byebug' for a debugger
end

group :development do
  gem 'httparty', '~> 0.21'
  gem 'listen', '~> 3.3' # performance popup; https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'nokogiri', '~> 1.13'
  gem 'rack-mini-profiler', '~> 2.0'
  gem 'spring' # https://github.com/rails/spring
  gem 'web-console', '>= 4.1.0' # insert 'console' in code to get an interactive console
end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'factory_bot_rails'
  gem 'rspec'
  gem 'rspec-rails'
  gem 'rubocop-rspec'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end
