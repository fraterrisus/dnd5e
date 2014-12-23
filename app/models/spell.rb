class Spell < ActiveRecord::Base
  has_and_belongs_to_many :caster_classes

  def self.level_to_s (l)
    (l == 0) ? 'Cantrip' : "Level #{l}"
  end

  def level_text
    self.class.level_to_s self.level
  end

  def school_text
    SpellSchool::to_s school_id
  end

  def reference_text
    "PHB p.#{page}"
  end

  # :nodoc:
  # Rails handily provides a Fixnum#[] getter method, but no setter.
  # Hmph.
  [ [ :verbal, 3 ], [ :somatic, 2 ], [ :material, 1 ], [ :focus, 0 ] ].each do |x|
    define_method(x[0]) do
      components[x[1]] == 1
    end

    define_method("#{x[0]}=") do |o|
      if value_to_boolean o
        c = components | (1 << x[1])
      else
        c = components & ~(1 << x[1])
      end
      self.send(:components=, c)
    end
  end
  # :doc:

  # If the spell can be cast as a reaction, returns a description of the
  # reaction. Otherwise returns nil
  def reaction_text
    (cast_unit == TimeUnit::Reaction) ? reaction : nil
  end

  def casting_time_text
    if cast_unit >= 10
      ct = "#{cast_n} #{TimeUnit.to_s(cast_unit).pluralize(cast_n)}"
    else
      ct = TimeUnit.to_s(cast_unit)
    end
    if ritual
      ct += " (ritual)"
    end
    ct.capitalize
  end

  def range_text
    if range_unit >= 10
      rt = "#{range_n}#{DistanceUnit.to_s(range_unit)}"
    else
      rt = DistanceUnit.to_s(range_unit)
    end
    rt
  end

  def components_text
    self.class.components_to_s(components)
  end

  def self.components_to_s (bitfield)
    cmp = []
    cmp << 'V' if bitfield[3] == 1
    cmp << 'S' if bitfield[2] == 1
    if bitfield[1] == 1
      if bitfield[0] == 1
        cmp << 'F'
      else
        cmp << 'M'
      end
    end
    cmp.join ','
  end

  def duration_text
    dt = ''
    if concentration
      dt += 'Concentration, up to '
    end
    if duration_unit >= 10
      dt += "#{duration_n} #{TimeUnit.to_s(duration_unit).pluralize(duration_n)}"
    else
      dt += TimeUnit.to_s(duration_unit)
    end
    dt.capitalize
  end
end
