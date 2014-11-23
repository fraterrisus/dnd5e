class TimeUnit
  Special = 0

  Action = 1
  Bonus = 2
  Reaction = 3
  Instant = 4
  Permanent = 5

  Rounds = 10
  Minutes = 11
  Hours = 12
  Days = 13

  def self.options_for_select
    %w( Special Action Bonus Reaction Instant
        Permanent Rounds Minutes Hours Days ).map do |t|
      c = self.const_get t
      [ self.to_s(c).capitalize, c ]
    end
  end

  def self.to_s (u)
    fail ArgumentError unless u.is_a? Fixnum

    case u
    when Special
      'special'
    when Action
      '1 action'
    when Bonus
      'bonus action'
    when Reaction
      'reaction'
    when Instant
      'instantaneous'
    when Permanent
      'until dispelled'
    when Rounds
      'round'
    when Minutes
      'minute'
    when Hours
      'hour'
    when Days
      'day'
    end
  end
end
