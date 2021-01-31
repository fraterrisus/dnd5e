require 'rails_helper'

RSpec.describe TimeUnit do
  before do
    @saved_locale = I18n.locale
  end

  after do
    I18n.locale = @saved_locale
  end

  # Class methods

  describe '::unit' do
    it 'translates values as expected' do
      [:special, :action, :bonus, :reaction, :instant, :permanent, nil, nil, nil, nil, :rounds,
       :minutes, :hours, :days].each_with_index do |unit, idx|
        expect(described_class.unit(idx)).to(eq(unit)) if unit
      end
    end
  end

  describe '::time' do
    it 'translates values as expected' do
      ['special', 'action', 'bonus action', 'reaction', 'instantaneous', 'until dispelled',
       nil, nil, nil, nil, 'rnd', 'min', 'hr', 'd'].each_with_index do |time, idx|
        expect(described_class.time(idx)).to(eq(time)) if time
      end
    end
  end

  describe '::options_for_select' do
    it 'returns the expected array' do
      expected_value = []
      ['Special', 'Action', 'Bonus', 'Reaction', 'Instant', 'Permanent', nil, nil, nil, nil,
       'Rounds', 'Minutes', 'Hours', 'Days'].each_with_index do |value, idx|
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
        is_expected.to eq(:special)
      end
    end

    context 'when the ID does not exist' do
      let(:id) { 9 }

      it 'throws an exception' do
        expect { subject }.to raise_error(ArgumentError)
      end
    end
  end

  describe '#time' do
    subject { described_class.new(id).time }

    context 'when the ID exists' do
      let(:id) { 0 }

      it 'translates the value' do
        is_expected.to eq('special')
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
