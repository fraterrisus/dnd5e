class Spell < ActiveRecord::Base
  has_and_belongs_to_many :caster_classes

  def to_asset
    nym.downcase.gsub(%r(['/]), '').gsub(/\s+/, '_')
  end

  def self.level_to_s(level)
    level.zero? ? I18n.t('helpers.label.spell.cantrip') : "Level #{level}"
  end

  def level_text
    self.class.level_to_s level
  end

  def range_text
    if range_unit >= 10
      "#{range_n}#{DistanceUnit.range(range_unit)}"
    else
      DistanceUnit.range(range_unit)
    end
  end

  def reference_text
    "PHB p.#{page}"
  end

  def school_text
    SpellSchool.school(school_id)
  end

  # :nodoc:
  # Rails handily provides a Fixnum#[] getter method, but no setter.
  # Hmph.
  [[:verbal, 3], [:somatic, 2], [:material, 1], [:focus, 0]].each do |x|
    define_method(x[0]) do
      components[x[1]] == 1
    end

    define_method("#{x[0]}=") do |o|
      c = if ActiveModel::Type::Boolean.new.cast(o)
        components | (1 << x[1])
      else
        components & ~(1 << x[1])
      end
      send(:components=, c)
    end
  end
  # :doc:

  def cast_as_reaction?
    TimeUnit.unit(cast_unit) == :reaction
  end

  def reaction_text
    cast_as_reaction? ? reaction : nil
  end

  def casting_time_text
    text = TimeUnit.time(cast_unit)
    text = "#{cast_n} #{text}" if cast_unit >= 10
    text += ' (ritual)' if ritual
    text.capitalize
  end

  def components_text
    self.class.components_to_s(components)
  end

  def self.components_to_s(bitfield)
    cmp = []
    cmp << 'V' if bitfield[3] == 1
    cmp << 'S' if bitfield[2] == 1
    cmp << (bitfield[0] == 1 ? 'F' : 'M') if bitfield[1] == 1
    cmp.join ','
  end

  def duration_text
    dt = ''
    dt += 'Concentration, up to ' if concentration
    dt += "#{duration_n} " if duration_unit >= 10
    dt += TimeUnit.time(duration_unit)
    dt.capitalize
  end
end
