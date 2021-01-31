class SpellSchool
  SCHOOLS = %i(abjuration conjuration divination enchantment
               evocation illusion necromancy transmutation).freeze

  def initialize(id)
    sym = SCHOOLS[id]
    raise ArgumentError unless sym

    @abbr = I18n.t("helpers.abbr.spell_school.#{sym}")
    @school = I18n.t("helpers.full.spell_school.#{sym}")
  end

  attr_reader :abbr, :school

  def self.abbr(id)
    new(id).abbr
  end

  def self.school(id)
    new(id).school
  end

  def self.options_for_select
    [].tap do |options|
      SCHOOLS.each_with_index do |sym, id|
        options << [I18n.t("helpers.full.spell_school.#{sym}"), id]
      end
    end
  end
end
