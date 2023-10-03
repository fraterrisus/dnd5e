require 'rails_helper'

RSpec.describe 'characters/_character_row.html.erb' do
  before do
    render partial: 'characters/character_row', locals: { char: char }
  end

  context 'always' do
    let(:char) { build(:character) }

    it 'prints the character name' do
      expect(rendered.match(char.nym))
    end

    it 'prints every attribute' do
      Character::TABLE_FIELDS.each do |attr|
        expect(rendered.match(char.public_send(attr).to_s))
      end
    end

    it 'writes an edit button' do
      expect(rendered.match(/edit-button/))
    end

    it 'writes an delete button' do
      expect(rendered.match(/delete-button/))
    end
  end

  context 'when the character is not highlighted' do
    let(:char) { build(:character, highlight: false) }

    it 'does not add the class TABLE-INFO' do
      expect(rendered.match(/table-info/)).to be_nil
    end
  end

  context 'when the character is highlighted' do
    let(:char) { build(:character, :highlighted) }

    it 'adds the TABLE-INFO class' do
      expect(rendered.match(/table-info/))
    end
  end

  context 'when the character does not have notes' do
    let(:char) { build(:character, notes: nil) }

    it 'prints one row' do
      expect(rendered.scan('<tr').count).to eq(1)
    end
  end

  context 'when the character has notes' do
    let(:char) { build(:character, :with_notes) }

    it 'prints two rows' do
      expect(rendered.scan('<tr').count).to eq(2)
    end
  end
end
