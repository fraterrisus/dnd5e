require 'rails_helper'

RSpec.describe 'Feature: List Spells', js: true do
  def generate_spells(n)
    @spells = []
    n.times do
      @spells << create(:spell, :random_nym, :random_level)
    end
  end

  context 'when there are no filters defined' do
    context 'and there are fewer than 20 results' do
      before do
        generate_spells(15)
        @spells.each_with_index do |spell, idx|
          spell.level = idx % 10
          spell.save
        end

        visit '/spells'
      end

      it 'does not show a tab bar' do
        expect(page.find(:css, '.results')).not_to have_css('ul.nav-tabs')
      end

      it 'displays the spell count' do
        expect(page).to have_content("Matched #{@spells.count} spells")
      end

      it 'displays every spell' do
        @spells.each { |spell| expect(page).to have_content(spell.nym) }
      end

      it 'sorts by name' do
        displayed_spell_names = page.all(:css, '.tab-content .spell-nym').map(&:text)
        expect(displayed_spell_names).to eq(displayed_spell_names.sort)
      end
    end

    context 'and there are more than 20 results' do
      before do
        generate_spells(50)
        @spells.each_with_index do |spell, idx|
          spell.level = idx % 10
          spell.save
        end

        visit '/spells'
      end

      it 'shows the tab bar' do
        expect(page.find(:css, 'div.results')).to have_css('ul.nav-tabs')
      end

      it 'shows a tab for every first letter of a spell' do
        tab_headers = page.all(:css, '.results .nav .nav-link').map(&:text)
        expected_tabs = @spells.map { |s| s.nym.first }.sort.uniq
        expect(tab_headers).to eq(expected_tabs)
      end

      it 'defaults to the first tab' do
        first_tab = page.first(:css, '.results .nav .nav-link')
        expect(first_tab).to match_selector('.active')
      end

      it 'sorts by name' do
        skip('Insists on finding only empty strings on non-active tabs')

        panes = page.all(:css, '.results .tab-content .tab-pane', visible: false)
        panes.each do |pane|
          match_data = pane[:id].match(/spells-(.)/)
          this_initial = match_data[1]
          spell_nyms = page.all(:css, "##{pane[:id]} .spell-nym", visible: false).map(&:text)
          puts 'find'
          expect(spell_nyms).to all(start_with(this_initial))
          expect(spell_nyms).to eq(spell_nyms.sort)
        end
      end
    end
  end
end
