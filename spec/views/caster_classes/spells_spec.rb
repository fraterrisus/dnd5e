require 'rails_helper'

RSpec.describe 'caster_classes/spells.html.erb' do
  let(:cclass) { create(:caster_class, :random_nym, spells: spells.sample(10)) }
  let(:spells) { [].tap { |a| 20.times { a << create(:spell, :random_nym, :random_level) } } }

  before do
    assign(:spells, spells)
    assign(:cclass, cclass)
    controller.request.path_parameters[:id] = cclass.id
    render
  end

  context 'when there are an even number of spells in a given level' do
    let(:spells) { [].tap { |a| 20.times { a << create(:spell, :random_nym, level: 2) } } }

    it 'has one checkbox for each spell' do
      spells.each do |spell|
        re = Regexp.new(/id="spell-#{spell.id}"/)
        results = rendered.scan(re)
        expect(results.count).to eq(1)
      end
    end
  end

  context 'when there are an odd number of spells in a given level' do
    let(:spells) { [].tap { |a| 15.times { a << create(:spell, :random_nym, level: 2) } } }

    it 'has one checkbox for each spell' do
      spells.each do |spell|
        re = Regexp.new(/id="spell-#{spell.id}"/)
        results = rendered.scan(re)
        expect(results.count).to eq(1)
      end
    end
  end

  def generate_spells(n)
    @spells = []
    n.times do
      @spells << create(:spell, :random_nym, :random_level)
    end
  end
end
