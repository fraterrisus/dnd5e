class SpellsController < ApplicationController

  before_filter :load_spell, only: [ :show, :edit, :update ]

  def index
  end

  def ajax_index
    searches = params.require('spell').
      permit([ 'none', 'caster_class_ids' => [], 'school_id' => [], 'level' => [], 'cast_unit' => [],
               'ritual' => [], 'range_unit' => [], 'components' => [], 'duration_unit' => [],
               'concentration' => [] ])
    searches.delete('none')

    if searches.has_key? 'components'
      if searches['components'].include?('1') && ! searches['components'].include?('2')
        searches['components'] << '2'
      end
      searches['components'] = searches['components'].reduce(0) { |x,y| x += y.to_i }
    end

    habtms = [ ]
    cclass_ids = searches.delete 'caster_class_ids'
    if cclass_ids && cclass_ids.any?
      habtms << :caster_classes
      searches['caster_classes'] = { id: cclass_ids }
    end

    @spells = Spell.includes(habtms).where(searches).order(:level, :name)

    render layout: nil
  end

  def ajax_caster_edit
    caster_id = params.require :id
    @caster = CasterClass.find(caster_id)
    @spells = Spell.order(:level, :name).all
    respond_to do |fmt|
      fmt.html { render layout: nil }
      fmt.json { render json: @spells }
    end
  end

  def show
  end

  def edit
  end

  def update
    data = params.require(:spell) \
      .permit(:name, :school_id, :level, :cast_n, :cast_unit, :ritual,
              :reaction, :range_n, :range_unit, :aoe, :verbal, :somatic,
              :material, :focus, :page, :duration_n, :duration_unit,
              :concentration, :effect, :higher)

    [ :reaction, :cast_n, :range_n, :aoe, :duration_n, :effect, :higher ].each do |f|
      data[f] = nil if data[f] == ""
    end

    @spell.update_attributes(data)

    respond_to do |f|
      f.html { redirect_to spell_url(@spell) }
      f.json { render json: @spell, status: :ok }
    end
  end

  private

  def load_spell
    id = params.require :id
    @spell = Spell.find id
  end

end
