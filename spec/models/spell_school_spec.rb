require 'rails_helper'

RSpec.describe SpellSchool do
  before do
    @saved_locale = I18n.locale
  end

  after do
    I18n.locale = @saved_locale
  end

  # Class methods

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

  # Instance methods

  describe '#abbr' do
    subject { described_class.new(id).abbr }

    context 'when the ID exists' do
      let(:id) { 0 }
      it { is_expected.to eq('Ab') }
    end

    context 'when the ID does not exist' do
      let(:id) { 9 }

      it 'throws an exception' do
        expect { subject }.to raise_error(ArgumentError)
      end
    end
  end

  describe '#school' do
    subject { described_class.new(id).school }

    context 'when the ID exists' do
      let(:id) { 0 }
      it { is_expected.to eq('Abjuration') }
    end

    context 'when the ID does not exist' do
      let(:id) { 9 }

      it 'throws an exception' do
        expect { subject }.to raise_error(ArgumentError)
      end
    end
  end
end
