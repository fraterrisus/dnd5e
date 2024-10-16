require 'rails_helper'

RSpec.describe 'Feature: Delete Caster Class', js: true do
  before do
    @cclass = create(:caster_class, :random_nym)
  end

  context 'when you click Delete' do
    before do
      visit '/classes'
      page.find('.delete-button').click
      wait_for_dialog_open
    end

    it 'opens the right modal' do
      expect(page).to have_css('#object-delete-modal')
    end

    it 'displays the stop sign' do
      expect(page).to have_css('.bi-exclamation-octagon-fill')
    end

    shared_examples_for 'a close button' do
      it 'does not update the list' do
        expect(page.find('.results')).to have_content(@cclass.nym)
      end
    end

    context 'and then click X' do
      before do
        page.find('.btn-close').click
        wait_for_dialog_close
      end

      it_behaves_like 'a close button'
    end

    context 'and then click Cancel' do
      before do
        page.find('.cancel-button').click
        wait_for_dialog_close
      end

      it_behaves_like 'a close button'
    end

    context 'and then click Submit' do
      before do
        @old_nym = @cclass.nym
        page.find_by_id('delete-object-ok').click
        wait_for_dialog_close
      end

      it 'updates the list' do
        expect(page.find('.results')).to have_no_content(@old_nym)
      end

      it 'deletes the object' do
        expect(CasterClass.where(nym: @old_nym)).to be_empty
      end
    end
  end

  def wait_for_dialog_open
    modal = page.find_by_id('object-delete-modal')
    Timeout.timeout(2) do
      loop until modal[:class].include?('show')
    end
  end

  def wait_for_dialog_close
    modal = page.find_by_id('object-delete-modal')
    Timeout.timeout(2) do
      loop if modal[:class].include?('show')
    end
  end
end
