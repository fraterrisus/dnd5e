class DistanceUnit
  UNITS = [:self, :touch, :sight, :plane, :unlimited, nil, nil, nil, nil, nil, :feet, :miles].freeze

  def initialize(id)
    unit = UNITS[id]
    raise(ArgumentError, id) unless unit

    @unit = I18n.t("attributes.full.range.#{unit}")
    @range = I18n.t("attributes.abbr.range.#{unit}")
  end

  attr_reader :unit, :range

  def self.range(id)
    new(id).range
  end

  def self.unit(id)
    new(id).unit
  end

  def self.options_for_select
    [].tap do |options|
      UNITS.each_with_index do |unit, idx|
        options << [I18n.t("attributes.full.range.#{unit}"), idx] if unit
      end
    end
  end
end
