require 'rails_helper'

RSpec.describe Spell do
  before do
    @saved_locale = I18n.locale
  end

  after do
    I18n.locale = @saved_locale
  end

  # Class Methods

  describe '::components_to_s' do
    it 'returns an empty string for zero' do
      expect(described_class.components_to_s(0x0)).to eq('')
    end

    it 'translates bit 3 as V' do
      expect(described_class.components_to_s(0x8)).to eq('V')     # 8---
      expect(described_class.components_to_s(0xA)).to eq('V,M')   # 8-2-
      expect(described_class.components_to_s(0xC)).to eq('V,S')   # 84--
      expect(described_class.components_to_s(0xE)).to eq('V,S,M') # 842-
    end

    it 'translates bit 2 as S' do
      expect(described_class.components_to_s(0x4)).to eq('S')     # -4--
      expect(described_class.components_to_s(0x6)).to eq('S,M')   # -42-
      expect(described_class.components_to_s(0xC)).to eq('V,S')   # 84--
      expect(described_class.components_to_s(0xE)).to eq('V,S,M') # 842-
    end

    it 'translates bit 1 as M' do
      expect(described_class.components_to_s(0x2)).to eq('M')     # --2-
      expect(described_class.components_to_s(0x6)).to eq('S,M')   # -42-
      expect(described_class.components_to_s(0xA)).to eq('V,M')   # 8-2-
      expect(described_class.components_to_s(0xE)).to eq('V,S,M') # 842-
    end

    it 'translates bits 1+0 as F' do
      expect(described_class.components_to_s(0x3)).to eq('F')     # --21
      expect(described_class.components_to_s(0x7)).to eq('S,F')   # -421
      expect(described_class.components_to_s(0xB)).to eq('V,F')   # 8-21
      expect(described_class.components_to_s(0xF)).to eq('V,S,F') # 8421
    end

    it 'ignores bit 0 if bit 1 is off' do
      expect(described_class.components_to_s(0x1)).to eq('')      # ---1
      expect(described_class.components_to_s(0x5)).to eq('S')     # -4-1
      expect(described_class.components_to_s(0x9)).to eq('V')     # 8--1
      expect(described_class.components_to_s(0xD)).to eq('V,S')   # 84-1
    end
  end

  describe '::level_to_s' do
    subject { described_class.level_to_s(lvl) }

    context 'when the spell is a cantrip' do
      let(:lvl) { 0 }
      it { is_expected.to eq('Cantrip') }
    end

    context 'when the spell is not a cantrip' do
      let(:lvl) { 3 }
      it { is_expected.to eq('Level 3') }
    end
  end

  # Instance Methods

  describe '#casting_time_text' do
    subject { spell.casting_time_text }

    context 'when the casting time unit does not have a count' do
      let(:spell) { build(:spell, :reaction) }

      it { is_expected.to eq('Reaction') }
    end

    context 'when the casting time unit has a count' do
      let(:spell) { build(:spell, :five_minutes) }

      it 'inserts a space between the count and the unit' do
        expect(subject).to eq('5 min')
      end
    end

    context 'when the spell can be cast as a ritual' do
      let(:spell) { build(:spell, :ritual) }

      it { is_expected.to end_with(' (ritual)') }
    end
  end

  describe '#components_text' do
    subject { spell.components_text }

    let(:spell) { build(:spell) }

    before { allow(Spell).to receive(:components_to_s).and_return('comp') }

    it 'delegates to the class method' do
      expect(subject).to eq('comp')
      expect(Spell).to have_received(:components_to_s).with(spell.components)
    end
  end

  describe '#duration_text' do
    subject { spell.duration_text }

    context 'when the duration unit does not have a count' do
      let(:spell) { build(:spell, duration_unit: 0, duration_n: nil) }

      it 'capitalizes the unit' do
        is_expected.to eq('Special')
      end
    end

    context 'when the duration unit has a count' do
      let(:spell) { build(:spell, duration_unit: 10, duration_n: 5) }

      it 'inserts a space between the count and the unit' do
        expect(subject).to eq('5 rnd')
      end
    end

    context 'when the spell requires concentration' do
      let(:spell) { build(:spell, :concentration) }

      it { is_expected.to start_with('Concentration, up to ') }
    end
  end

  describe '#focus' do
    subject { spell.focus }

    let(:bit) { 0x1 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when the spell has no components' do
      let(:bitfield) { 0x0 }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only other components' do
      let(:bitfield) { 0xF - bit }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only this component' do
      let(:bitfield) { bit }
      it { is_expected.to be_truthy }
    end

    context 'when the spell has all components' do
      let(:bitfield) { 0xF }
      it { is_expected.to be_truthy }
    end
  end

  describe '#focus=' do
    subject { spell.focus = assignment }

    let(:bit) { 0x1 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when assigned to true' do
      let(:bitfield) { 0 }
      let(:assignment) { true }

      it 'sets the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(bit)
      end
    end

    context 'when assigned to false' do
      let(:bitfield) { 0xF }
      let(:assignment) { false }

      it 'clears the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(0xF - bit)
      end
    end
  end

  describe '#level_text' do
    subject { spell.level_text }

    context 'when the spell is a cantrip' do
      let(:spell) { build(:spell, :cantrip) }
      it { is_expected.to eq('Cantrip') }
    end

    context 'when the spell is not a cantrip' do
      let(:spell) { build(:spell, level: 3) }
      it { is_expected.to eq('Level 3') }
    end
  end

  describe '#material' do
    subject { spell.material }

    let(:bit) { 0x1 << 1 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when the spell has no components' do
      let(:bitfield) { 0x0 }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only other components' do
      let(:bitfield) { 0xF - bit }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only this component' do
      let(:bitfield) { bit }
      it { is_expected.to be_truthy }
    end

    context 'when the spell has all components' do
      let(:bitfield) { 0xF }
      it { is_expected.to be_truthy }
    end
  end

  describe '#material=' do
    subject { spell.material = assignment }

    let(:bit) { 0x1 << 1 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when assigned to true' do
      let(:bitfield) { 0 }
      let(:assignment) { true }

      it 'sets the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(bit)
      end
    end

    context 'when assigned to false' do
      let(:bitfield) { 0xF }
      let(:assignment) { false }

      it 'clears the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(0xF - bit)
      end
    end
  end

  describe '#range_text' do
    subject { spell.range_text }

    context 'when the range unit does not have a count' do
      let(:spell) { build(:spell, range_unit: 0, range_n: nil) }

      it 'does not capitalize the unit' do
        is_expected.to eq('self')
      end
    end

    context 'when the range unit has a count' do
      let(:spell) { build(:spell, range_unit: 10, range_n: 5) }

      it 'appends the count and the unit' do
        is_expected.to eq("5'")
      end
    end
  end

  describe '#school_text' do
    subject { spell.school_text }

    let(:spell) { build(:spell) }

    before { allow(SpellSchool).to receive(:school).and_return('Conj') }

    it 'delegates to SpellSchool' do
      expect(subject).to eq('Conj')
      expect(SpellSchool).to have_received(:school).with(spell.school_id)
    end
  end

  describe '#somatic' do
    subject { spell.somatic }

    let(:bit) { 0x1 << 2 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when the spell has no components' do
      let(:bitfield) { 0x0 }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only other components' do
      let(:bitfield) { 0xF - bit }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only this component' do
      let(:bitfield) { bit }
      it { is_expected.to be_truthy }
    end

    context 'when the spell has all components' do
      let(:bitfield) { 0xF }
      it { is_expected.to be_truthy }
    end
  end

  describe '#somatic=' do
    subject { spell.somatic = assignment }

    let(:bit) { 0x1 << 2 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when assigned to true' do
      let(:bitfield) { 0 }
      let(:assignment) { true }

      it 'sets the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(bit)
      end
    end

    context 'when assigned to false' do
      let(:bitfield) { 0xF }
      let(:assignment) { false }

      it 'clears the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(0xF - bit)
      end
    end
  end

  describe '#to_asset' do
    subject { spell.to_asset }

    let(:spell) { build(:spell, nym: test_name) }

    context 'when the name is one word' do
      let(:test_name) { 'Easy' }

      it 'downcases capital letters' do
        is_expected.to eq('easy')
      end
    end

    context 'when the name is multiple words' do
      let(:test_name) { 'Two     Words' }

      it 'replaces spaces with an underscore' do
        is_expected.to eq('two_words')
      end
    end

    context 'when the name has odd characters' do
      let(:test_name) { "Bob's Red/Green Spell" }

      it 'eliminates apostrophes and slashes' do
        is_expected.to eq('bobs_redgreen_spell')
      end
    end
  end

  describe '#verbal' do
    subject { spell.verbal }

    let(:bit) { 0x1 << 3 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when the spell has no components' do
      let(:bitfield) { 0x0 }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only other components' do
      let(:bitfield) { 0xF - bit }
      it { is_expected.to be_falsey }
    end

    context 'when the spell has only this component' do
      let(:bitfield) { bit }
      it { is_expected.to be_truthy }
    end

    context 'when the spell has all components' do
      let(:bitfield) { 0xF }
      it { is_expected.to be_truthy }
    end
  end

  describe '#verbal=' do
    subject { spell.verbal = assignment }

    let(:bit) { 0x1 << 3 }
    let(:spell) { build(:spell, components: bitfield) }

    context 'when assigned to true' do
      let(:bitfield) { 0 }
      let(:assignment) { true }

      it 'sets the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(bit)
      end
    end

    context 'when assigned to false' do
      let(:bitfield) { 0xF }
      let(:assignment) { false }

      it 'clears the correct bit in the components bitfield' do
        subject
        expect(spell.components).to eq(0xF - bit)
      end
    end
  end
end
