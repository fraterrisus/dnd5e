class CasterClassesController < ApplicationController
  before_action :load_caster_class, only: [:edit, :confirm_delete, :update]

  def index
    respond_to do |fmt|
      fmt.json { redirect_to action: :ajax_index, format: :json }
      fmt.html
    end
  end

  def ajax_index
    @cclasses = CasterClass.order(:name).all
    respond_to do |fmt|
      fmt.json { render json: @cclasses }
      fmt.html { render layout: nil }
    end
  end

  def new
    @cclass = nil
    render :edit, layout: nil
  end

  def edit
    render layout: nil
  end

  def confirm_delete
    render layout: nil
  end

  def update
    p = params.require('caster_class').permit('id', 'name', 'spell_ids' => [])
    p.delete('id')
    @cclass.update p
    render json: @cclass
  end

  def create
    p = params.require('caster_class').permit('name')
    cclass = CasterClass.create(p)
    render json: cclass
  end

  def destroy
    id = params.require(:id)
    CasterClass.destroy id
    head :no_content
  end

  private

  def load_caster_class
    id = params.require :id
    @cclass = CasterClass.find id
  end
end
