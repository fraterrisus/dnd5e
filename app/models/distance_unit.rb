class DistanceUnit
  UNITS = {
    0 => { unit: 'Self', range: 'self' },
    1 => { unit: 'Touch', range: 'touch' },
    2 => { unit: 'Sight', range: 'sight' },
    3 => { unit: 'Plane', range: 'same plane' },
    4 => { unit: 'Unlimited', range: 'unlimited' },
    10 => { unit: 'Feet', range: "'" },
    11 => { unit: 'Miles', range: 'mi' }
  }.freeze

  def initialize(id)
    raise(ArgumentError, id) unless UNITS.keys.include? id

    @unit = UNITS[id][:unit]
    @range = UNITS[id][:range]
  end

  attr_reader :unit, :range

  def self.range(id)
    new(id).range
  end

  def self.unit(id)
    new(id).unit
  end

  def self.options_for_select
    UNITS.map do |id, data|
      [data[:unit], id]
    end
  end
end
