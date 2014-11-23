class SpellsController < ApplicationController

  before_filter :load_spell, only: [ :show, :edit, :update ]

  def index
    @spells = Spell.all.order(:name)
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
