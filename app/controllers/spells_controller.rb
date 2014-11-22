class SpellsController < ApplicationController
  def index
    @spells = Spell.all.order(:name)
  end

  def show
    @spell = Spell.find params[:id]
  end
end
