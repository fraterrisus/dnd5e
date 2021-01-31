class Spell < ActiveRecord::Base
  has_and_belongs_to_many :caster_classes

  def to_asset
    nym.downcase.gsub(%r(['/]), '').gsub(/\s+/, '_')
  end

  def self.level_to_s(level)
    if level.zero?
      I18n.t('helpers.label.spell.cantrip')
    else
      "#{I18n.t('attributes.full.spell.level')} #{level}"
    end
  end

  def level_text
    self.class.level_to_s level
  end

  def range_text
    ''.tap do |text|
      text << range_n.to_s if range_unit >= 10
      text << DistanceUnit.range(range_unit)
    end
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

  def casting_time_text
    ''.tap do |text|
      text << "#{cast_n} " if cast_unit >= 10
      text << TimeUnit.time(cast_unit)
      text << " (#{I18n.t('attributes.full.spell.ritual')})" if ritual
    end.capitalize
  end

  def components_text
    self.class.components_to_s(components)
  end

  def self.components_to_s(bitfield)
    [].tap do |cmp|
      cmp << 'V' if bitfield[3] == 1
      cmp << 'S' if bitfield[2] == 1
      cmp << (bitfield[0] == 1 ? 'F' : 'M') if bitfield[1] == 1
    end.join ','
  end

  def duration_text
    ''.tap do |text|
      text << "#{I18n.t('attributes.full.spell.concentration')} " if concentration
      text << "#{duration_n} " if duration_unit >= 10
      text << TimeUnit.time(duration_unit)
    end.capitalize
  end
end
