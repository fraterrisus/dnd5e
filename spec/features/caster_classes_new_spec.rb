require 'rails_helper'

RSpec.describe 'Feature: Create Caster Class', js: true do
  before do
    @cclass = create(:caster_class, :random_nym)
  end

  context 'when you click New' do
    before do
      visit '/classes'
      page.find('.new-button').click
    end

    it 'opens the right modal' do
      expect(page).to have_css('#object-modal')
    end

    it 'does not populate the nym field' do
      nym_field = page.find_field('caster_class[nym]')
      expect(nym_field).to be_present
      expect(nym_field.value).to be_empty
    end

    shared_examples 'a close button' do
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

    context 'and then click Submit' do
      before do
        fill_in('caster_class[nym]', with: 'Random')
        page.find('#object-modal-ok').click
        wait_for_dialog_close
      end

      it 'updates the list' do
        results = page.find('.results')
        expect(results).to have_content(@cclass.nym)
        expect(results).to have_content('Random')
      end

      it 'creates a new object' do
        old_nym = @cclass.nym
        @cclass.reload
        expect(@cclass.nym).to eq(old_nym)
        expect(CasterClass.find_by(nym: 'Random')).to be_present
      end
    end
  end

  def wait_for_dialog_close
    expect(page.has_no_css?('#object-modal'))
  end
end
