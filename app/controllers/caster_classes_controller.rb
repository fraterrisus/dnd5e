class CasterClassesController < ApplicationController
  before_action :load_caster_class, only: [:edit, :update]

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

  def edit; end

  def update
    p = params.require('caster_class').permit('id', 'name', 'spell_ids' => [])
    p.delete('id')
    @cclass.update_attributes(p)
    redirect_to action: :edit
  end

  def create
    p = params.require('caster_class').permit('name')
    cclass = CasterClass.create(p)
    render json: cclass
  end

  private

  def load_caster_class
    id = params.require :id
    @cclass = CasterClass.find id
  end
end
