class CombatantsController < ApplicationController

  def index
    render json: Combatant.all
  end

  def initiative
  end

  def create
    data = params.require(:combatant).permit(:name, :count, :effect, :active)
    cmb = Combatant.create(data)
    render json: cmb
  end

  def update
    id = params.require(:id)
    data = params.require(:combatant).permit(:name, :count, :effect, :active)
    cmb = Combatant.find(id)
    cmb.update_attributes(data)
    render json: cmb
  end

  def clear
    Combatant.destroy_all()
    render json: nil
  end

  def last_update
    render json: { last_update: Combatant.all.map(&:updated_at).max.to_i }
  end

end