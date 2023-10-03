require 'rails_helper'

RSpec.describe 'Feature: List Characters', js: true do
  before do
    @characters = 25.times.map do
      if Random.rand < 0.3
        create(:character, :with_notes)
      else
        create(:character)
      end
    end

    visit '/characters'
  end

  it 'displays a New button' do
    expect(page).to have_css('.new-button')
  end

  it 'has a div for AJAX results' do
    expect(page).to have_css('.results')
  end

  it 'builds the expected modals' do
    expect(page).to have_css('#object-modal', :hidden)
    expect(page).to have_css('#object-delete-modal', :hidden)
  end

  it 'builds a row for every character' do
    rows = page.all(:xpath, '//tr')
    row_ids = rows.pluck(:id)
    @characters.each do |char|
      expect(row_ids).to include("char-#{char.id}")
      if char.notes.present?
        expect(row_ids).to include("notes-#{char.id}")
      else
        expect(row_ids).not_to include("notes-#{char.id}")
      end
    end
  end
end
