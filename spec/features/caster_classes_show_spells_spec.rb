require 'rails_helper'

RSpec.describe 'Feature: Create Caster Class', js: true do
  before do
    generate_spells(20)
    @spells_known = @spells.sample(10)
    @cclass = create(:caster_class, :random_nym, spells: @spells_known)
  end

  context 'when you click Spells' do
    before do
      visit '/classes'
      page.find('.view-button').click
      wait_for_dialog_open
    end

    it 'opens the right modal' do
      expect(page).to have_css('#spells-modal')
    end

    it 'populates the modal header with the class nym' do
      title = page.find(:css, '.modal-title')
      expect(title.text).to eq(@cclass.nym)
    end

    it 'displays all spells in the database' do
      @spells.map(&:nym).each do |nym|
        expect(page).to have_text(nym)
      end
    end

    it 'pre-selects the known spells' do
      known_spell_ids = @spells_known.map(&:id)
      @spells.each do |spell|
        checkbox = page.find_by_id("spell-#{spell.id}")
        if known_spell_ids.include? spell.id
          expect(checkbox[:checked]).not_to be_nil
        else
          expect(checkbox[:checked]).to be_nil
        end
      end
    end

    shared_examples_for 'a close button' do
      it 'does not update the list' do
        old_spell_ids = @spells_known.map(&:id)
        @cclass.reload
        new_spell_ids = @cclass.spell_ids
        expect(new_spell_ids).to match_array(old_spell_ids)
      end
    end

    context 'and then click X' do
      before do
        css_id = "input#spell-#{find_unknown_spell_id}"
        page.find(:css, css_id).click
        page.find(:css, '.btn-close').click
        wait_for_dialog_close
      end

      it_behaves_like 'a close button'
    end

    context 'and then click Cancel' do
      before do
        css_id = "input#spell-#{find_unknown_spell_id}"
        page.find(:css, css_id).click
        page.find(:css, '.cancel-button').click
        wait_for_dialog_close
      end

      it_behaves_like 'a close button'
    end

    context 'and then click Update' do
      before do
        @new_spell_id = find_unknown_spell_id
        css_id = "input#spell-#{@new_spell_id}"
        page.find(:css, css_id).click
        page.find_by_id('spells-modal-ok').click
        wait_for_dialog_close
      end

      it 'updates the class spell list' do
        expected_spell_ids = @spells_known.map(&:id)
        expected_spell_ids << @new_spell_id
        @cclass.reload
        new_spell_ids = @cclass.spell_ids
        expect(new_spell_ids).to match_array(expected_spell_ids)
      end
    end
  end

  def find_unknown_spell_id
    known_ids = @spells_known.map(&:id)
    @spells.map(&:id).find { |id| !known_ids.include?(id) }
  end

  def generate_spells(n)
    @spells = []
    n.times do
      @spells << create(:spell, :random_nym, :random_level)
    end
  end

  def wait_for_dialog_open
    modal = page.find(:css, '#spells-modal', visible: false)
    Timeout.timeout(2) do
      loop until modal[:class].include?('show')
    end
  end

  def wait_for_dialog_close
    modal = page.find(:css, '#spells-modal', visible: false)
    Timeout.timeout(2) do
      loop if modal[:class].include?('show')
    end
  end
end
