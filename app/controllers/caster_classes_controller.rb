class CasterClassesController < ApplicationController
  before_action :load_caster_class, only: [:edit, :confirm_delete, :spells, :update, :update_spells]

  def index
    respond_to do |fmt|
      fmt.json { redirect_to action: :list, format: :json }
      fmt.html
    end
  end

  def new
    @cclass = nil
    render :edit, layout: nil
  end

  def edit
    render layout: nil
  end

  def create
    p = params.require(:caster_class).permit(:nym)
    cclass = CasterClass.create(p)
    render json: cclass
  end

  def update
    p = params.require(:caster_class).permit(:id, :nym)
    p.delete(:id)
    @cclass.update p
    render json: @cclass
  end

  def destroy
    id = params.require(:id)
    CasterClass.destroy id
    head :no_content
  end

  def list
    @cclasses = CasterClass.order(:nym).all
    respond_to do |fmt|
      fmt.json { render json: @cclasses }
      fmt.html { render layout: nil }
    end
  end

  def confirm_delete
    render layout: nil
  end

  def spells
    respond_to do |fmt|
      fmt.json do
        @spells = @cclass.spells.order(:level, :nym)
        render json: @spells
      end
      fmt.html do
        @spells = Spell.order(:level, :nym).all
        render layout: nil
      end
    end
  end

  def update_spells
    data = params.require :spell_ids
    @cclass.update(spell_ids: data.keys.map(&:to_i))
    head :no_content
  end

  private

  def load_caster_class
    id = params.require :id
    @cclass = CasterClass.find id
  end
end
