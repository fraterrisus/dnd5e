require 'rails_helper'

RSpec.describe 'Feature: Edit Caster Class', js: true do
  before do
    @cclass = create(:caster_class, :random_nym)
  end

  context 'when you click Edit' do
    before do
      visit '/classes'
      page.find('.edit-button').click
      wait_for_dialog_open
    end

    it 'opens the right modal' do
      expect(page).to have_css('#object-modal')
    end

    it 'populates the nym field' do
      nym_field = page.find_field('caster_class[nym]')
      expect(nym_field).to be_present
      expect(nym_field.value).to eq(@cclass.nym)
    end

    shared_examples_for 'a close button' do
      it 'does not update the list' do
        results = page.find('.results')
        expect(results).to have_content(@cclass.nym)
        expect(results).not_to have_content('Random')
      end
    end

    context 'and then click X' do
      before do
        fill_in('caster_class[nym]', with: 'Random')
        page.find('.btn-close').click
        wait_for_dialog_close
      end

      it_behaves_like 'a close button'
    end

    context 'and then click Cancel' do
      before do
        fill_in('caster_class[nym]', with: 'Random')
        page.find('.cancel-button').click
        wait_for_dialog_close
      end

      it_behaves_like 'a close button'
    end

    context 'and then click the Submit button' do
      before do
        fill_in('caster_class[nym]', with: 'Random')
        page.find_by_id('object-modal-ok').click
        wait_for_dialog_close
      end

      it 'updates the list' do
        results = page.find('.results')
        expect(results).not_to have_content(@cclass.nym)
        expect(results).to have_content('Random')
      end

      it 'updates the object' do
        @cclass.reload
        expect(@cclass.nym).to eq('Random')
      end
    end
  end

  def wait_for_dialog_open
    modal = page.find_by_id('object-modal', visible: false)
    Timeout.timeout(2) do
      loop until modal[:class].include?('show')
    end
  end

  def wait_for_dialog_close
    modal = page.find_by_id('object-modal', visible: false)
    Timeout.timeout(2) do
      loop if modal[:class].include?('show')
    end
  end
end
