require 'rails_helper'

RSpec.describe SpellSchool do
  before do
    @saved_locale = I18n.locale
  end

  after do
    I18n.locale = @saved_locale
  end

  describe '::abbr' do
    it 'translates values as expected' do
      %w(Ab Co Dv En Ev Il Nc Tr).each_with_index do |abbr, idx|
        expect(described_class.abbr(idx)).to eq(abbr)
      end
    end
  end

  describe '::school' do
    it 'translates values as expected' do
      %w(Abjuration Conjuration Divination Enchantment Evocation Illusion Necromancy Transmutation)
        .each_with_index do |value, idx|
        expect(described_class.school(idx)).to eq(value)
      end
    end
  end

  describe '::options_for_select' do
    it 'returns the expected array' do
      expected_value = []
      %w(Abjuration Conjuration Divination Enchantment Evocation Illusion Necromancy Transmutation)
        .each_with_index do |value, idx|
        expected_value << [value, idx]
      end
      expect(described_class.options_for_select).to eq(expected_value)
    end
  end
end
