#!/usr/bin/env ruby

require 'httparty'
require 'nokogiri'

BASE_URL = 'https://5thsrd.org'
OUTPUT_DIR = "#{File.dirname(__FILE__)}/../public/spells/"

request = HTTParty.get("#{BASE_URL}/spellcasting/spell_indexes/spells_by_name")
document = Nokogiri::HTML.parse(request.body)
urls = document.css('div#page-content li').map do |node|
  node.children.first.attributes['href'].value
end

Dir.mkdir(OUTPUT_DIR) unless Dir.exist?(OUTPUT_DIR)

urls.each do |url|
  spell_name = url.split('/').last

  filename = "#{OUTPUT_DIR}/#{spell_name}.html"
  if File.exist?(filename)
    warn "#{File.basename(filename)} exists, skipping"
    next
  end

  spell_request = HTTParty.get("#{BASE_URL}#{url}")
  spell_document = Nokogiri::HTML.parse(spell_request.body)
  spell_description = spell_document.css('div#page-content').children.map(&:to_s).join.strip
  File.write(filename, spell_description)
  warn File.basename(filename)
end
