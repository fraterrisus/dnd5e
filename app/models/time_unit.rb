class TimeUnit
  UNITS = {
    0 => { unit: :special, time: 'special' },
    1 => { unit: :action, time: 'action' },
    2 => { unit: :bonus, time: 'bonus action' },
    3 => { unit: :reaction, time: 'reaction' },
    4 => { unit: :instant, time: 'instantaneous' },
    5 => { unit: :permanent, time: 'until dispelled' },
    10 => { unit: :rounds, time: 'rnd' },
    11 => { unit: :minutes, time: 'min' },
    12 => { unit: :hours, time: 'hr' },
    13 => { unit: :days, time: 'd' }
  }.freeze

  def initialize(id)
    raise(ArgumentError, id) unless UNITS.keys.include? id

    @unit = UNITS[id][:unit]
    @time = UNITS[id][:time]
  end

  attr_reader :time, :unit

  def self.time(id)
    new(id).time
  end

  def self.unit(id)
    new(id).unit
  end

  def self.options_for_select
    UNITS.map do |id, data|
      [data[:unit].to_s.capitalize, id]
    end
  end
end
