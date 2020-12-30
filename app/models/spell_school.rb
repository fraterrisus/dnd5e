class SpellSchool
  SCHOOLS = {
    0 => { school: 'Abjuration', abbr: 'Ab' },
    1 => { school: 'Conjuration', abbr: 'Co' },
    2 => { school: 'Divination', abbr: 'Dv' },
    3 => { school: 'Enchantment', abbr: 'En' },
    4 => { school: 'Evocation', abbr: 'Ev' },
    5 => { school: 'Illusion', abbr: 'Il' },
    6 => { school: 'Necromancy', abbr: 'Nc' },
    7 => { school: 'Transmutation', abbr: 'Tr' }
  }.freeze

  def initialize(id)
    raise ArgumentError unless SCHOOLS.keys.include? id

    @abbr = SCHOOLS[id][:abbr]
    @school = SCHOOLS[id][:school]
  end

  attr_reader :abbr, :school

  def self.abbr(id)
    new(id).abbr
  end

  def self.school(id)
    new(id).school
  end

  def self.options_for_select
    SCHOOLS.map do |id, data|
      [data[:school], id]
    end
  end
end
