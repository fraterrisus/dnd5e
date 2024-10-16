source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.4'

gem 'rubyzip', '~> 2.3' # be intentional about the upgrade to 3.0

gem 'bootsnap', '>= 1.4', require: false # boot caching, see config/boot.rb
gem 'cssbundling-rails'
gem 'jbuilder', '~> 2.11'
gem 'jsbundling-rails'
gem 'puma', '~> 6.4'
gem 'rack', '~>3.0'
gem 'rails', '~> 7.0'
gem 'redcarpet', '~> 3.6' # allows rendering Markdown
gem 'rubocop-rails'
gem 'sass-rails', '>= 6'
gem 'sqlite3', '~> 1.4'

# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw] # similar to 'pry', call 'byebug' for a debugger
end

group :development do
  gem 'foreman'
  gem 'httparty', '~> 0.21'
  gem 'listen', '~> 3.3' # performance popup; https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'nokogiri', '~> 1.16'
  gem 'rack-mini-profiler', '~> 3.0'
  gem 'spring' # https://github.com/rails/spring
  gem 'web-console', '>= 4.1.0' # insert 'console' in code to get an interactive console
end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'factory_bot', '~> 6.0'
  gem 'factory_bot_rails'
  gem 'rspec'
  gem 'rspec-rails'
  gem 'rubocop-rspec'
  gem 'selenium-webdriver'
end

gem "rubocop-capybara", "~> 2.21"

gem "rubocop-factory_bot", "~> 2.26"
gem "rubocop-rspec_rails", "~> 2.30"
