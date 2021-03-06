class CombatantsController < ApplicationController
  def index; end

  def create
    data = params.require(:combatant).permit(:nym, :time, :notes, :active)
    cmb = Combatant.create(data)
    render json: cmb
  end

  def new
    @char = nil
    render :edit, layout: nil
  end

  def edit
    id = params.require(:id)
    @char = Combatant.find id
    render layout: nil
  end

  def update
    id = params.require(:id)
    data = params.require(:combatant).permit(:nym, :time, :notes, :active)
    cmb = Combatant.find(id)
    cmb.update(data)
    render json: cmb
  end

  def destroy
    id = params.require(:id)
    Combatant.destroy(id)
    head :no_content
  end

  def list
    @combatants = Combatant.all.sort_by(&:time)
    respond_to do |fmt|
      fmt.html { render layout: nil }
      fmt.json { render json: @combatants }
    end
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
