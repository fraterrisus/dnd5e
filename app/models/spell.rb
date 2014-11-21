class Spell < ActiveRecord::Base

  def reference_text
    "PHB p.#{page}"
  end

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
    bitfield = components
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
