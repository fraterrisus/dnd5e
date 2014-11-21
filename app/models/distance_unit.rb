class DistanceUnit
  Self = 0
  Touch = 1
  Sight = 2
  Plane = 3
  Unlimited = 4
  Feet = 10
  Miles = 11

  def self.to_s (u)
    fail ArgumentError unless u.is_a? Fixnum

    case u
    when Self
      'self'
    when Touch
      'touch'
    when Sight
      'sight'
    when Plane
      'same plane'
    when Unlimited
      'unlimited'
    when Feet
      "'"
    when Miles
      'mi'
    end
  end
end
