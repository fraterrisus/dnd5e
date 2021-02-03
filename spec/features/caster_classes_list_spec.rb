require 'rails_helper'

RSpec.describe 'Feature: List Caster Classes', js: true do
  before do
    @cclasses = []
    5.times { @cclasses << create(:caster_class, :random_nym) }

    visit '/classes'
  end

  it 'displays a New button' do
    expect(page).to have_css('.new-button')
  end

  it 'has a div for AJAX results' do
    expect(page).to have_css('.results')
  end

  it 'builds the expected modals' do
    expect(page).to have_css('#object-modal', visible: false)
    expect(page).to have_css('#object-delete-modal', visible: false)
    expect(page).to have_css('#spells-modal', visible: false)
  end

  it 'displays a sorted list of caster classes' do
    cclass_nyms = page.all(:css, '.results .card-body .list-group-item #class-nym').map(&:text)
    expected_nyms = @cclasses.map(&:nym).sort
    expect(cclass_nyms).to eq(expected_nyms)
  end

  it 'displays buttons for each row' do
    cclass_rows = page.all(:css, '.results .card-body .list-group-item')
    cclass_rows.each do |row|
      expect(row[:'data-object-id']).to be_present
      expect(row).to have_css('.view-button')
      expect(row).to have_css('.edit-button')
      expect(row).to have_css('.delete-button')
    end
  end
end
