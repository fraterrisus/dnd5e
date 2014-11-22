class SpellSchool
  Abjuration = 0
  Conjuration = 1
  Divination = 2
  Enchantment = 3
  Evocation = 4
  Illusion = 5
  Necromancy = 6
  Transmutation = 7

  def self.to_s (x)
    case x
    when Abjuration
      'Abjuration'
    when Conjuration
      'Conjuration'
    when Divination
      'Divination'
    when Enchantment
      'Enchantment'
    when Evocation
      'Evocation'
    when Illusion
      'Illusion'
    when Necromancy
      'Necromancy'
    when Transmutation
      'Transmutation'
    else
      fail ArgumentError
    end
  end

  def self.abbr (x)
    case x
    when Abjuration
      'Ab'
    when Conjuration
      'Co'
    when Divination
      'Dv'
    when Enchantment
      'En'
    when Evocation
      'Ev'
    when Illusion
      'Il'
    when Necromancy
      'Nc'
    when Transmutation
      'Tr'
    else
      fail ArgumentError
    end
  end
end
