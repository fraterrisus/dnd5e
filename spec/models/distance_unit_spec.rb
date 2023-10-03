require 'rails_helper'

RSpec.describe DistanceUnit do
  # rubocop:disable Rails/I18nLocaleAssignment
  before do
    @saved_locale = I18n.locale
  end

  after do
    I18n.locale = @saved_locale
  end
  # rubocop:enable Rails/I18nLocaleAssignment

  # Class methods

  describe '::unit' do
    it 'translates values as expected' do
      ['Self', 'Touch', 'Sight', 'Plane', 'Unlimited', nil, nil, nil, nil, nil, 'Feet', 'Miles']
        .each_with_index do |unit, idx|
        expect(described_class.unit(idx)).to(eq(unit)) if unit
      end
    end
  end

  describe '::range' do
    it 'translates values as expected' do
      ['self', 'touch', 'sight', 'same plane', 'unlimited', nil, nil, nil, nil, nil, "'", 'mi']
        .each_with_index do |range, idx|
        expect(described_class.range(idx)).to(eq(range)) if range
      end
    end
  end

  describe '::options_for_select' do
    it 'returns the expected array' do
      expected_value = []
      ['Self', 'Touch', 'Sight', 'Plane', 'Unlimited', nil, nil, nil, nil, nil, 'Feet', 'Miles']
        .each_with_index do |value, idx|
        expected_value << [value, idx] if value
      end
      expect(described_class.options_for_select).to eq(expected_value)
    end
  end

  # Instance methods

  describe '#unit' do
    subject { described_class.new(id).unit }

    context 'when the ID exists' do
      let(:id) { 0 }

      it 'translates the value' do
        is_expected.to eq('Self')
      end
    end

    context 'when the ID does not exist' do
      let(:id) { 9 }

      it 'throws an exception' do
        expect { subject }.to raise_error(ArgumentError)
      end
    end
  end

  describe '#range' do
    subject { described_class.new(id).range }

    context 'when the ID exists' do
      let(:id) { 0 }

      it 'translates the ID' do
        is_expected.to eq('self')
      end
    end

    context 'when the ID does not exist' do
      let(:id) { 9 }

      it 'throws an exception' do
        expect { subject }.to raise_error(ArgumentError)
      end
    end
  end
end
