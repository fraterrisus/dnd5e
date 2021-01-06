class CombatantsController < ApplicationController
  def index
    @combatants = Combatant.all.sort_by(&:count)
    respond_to do |fmt|
      fmt.html { render layout: nil }
      fmt.json { render json: @combatants }
    end
  end

  def initiative; end

  def create
    data = params.require(:combatant).permit(:name, :count, :effect, :active)
    cmb = Combatant.create(data)
    render json: cmb
  end

  def update
    id = params.require(:id)
    data = params.require(:combatant).permit(:name, :count, :effect, :active)
    cmb = Combatant.find(id)
    cmb.update(data)
    render json: cmb
  end

  def activate
    id = params.require(:id)
    Combatant.update_all(active: false)
    cmb = Combatant.find(id)
    cmb.update_column(:active, true)
    head :no_content
  end

  def clear
    Combatant.destroy_all
    head :no_content
  end
end
