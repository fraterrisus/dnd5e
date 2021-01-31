class TimeUnit
  UNITS = [:special, :action, :bonus, :reaction, :instant, :permanent, nil, nil, nil, nil,
           :rounds, :minutes, :hours, :days].freeze

  def initialize(id)
    unit = UNITS[id]
    raise(ArgumentError, id) unless unit

    @unit = unit
    @time = I18n.t("attributes.full.time.#{unit}")
  end

  attr_reader :time, :unit

  def self.time(id)
    new(id).time
  end

  def self.unit(id)
    new(id).unit
  end

  def self.options_for_select
    [].tap do |options|
      UNITS.each_with_index do |unit, idx|
        options << [unit.to_s.capitalize, idx] if unit
      end
    end
  end
end
