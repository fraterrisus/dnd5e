class CharactersController < ApplicationController
  def index
    respond_to do |fmt|
      fmt.json { redirect_to action: :ajax_index, format: :json }
      fmt.html
    end
  end

  def ajax_index
    @chars = Character.order(:name).all
    respond_to do |fmt|
      fmt.json { render json: @chars }
      fmt.html { render layout: nil }
    end
  end

  def new
    @char = nil
    render :edit, layout: nil
  end

  def edit
    id = params.require(:id)
    @char = Character.find id
    render layout: nil
  end

  def update
    id = params.require(:id)
    data = params.require(:character)
      .permit(:name, :str, :dex, :con, :int, :wis, :chr,
              :perception, :initiative, :speed, :ac, :notes, :highlight)
    char = Character.find id
    char.update data
    render json: char
  end

  def create
    data = params.require(:character)
      .permit(:name, :str, :dex, :con, :int, :wis, :chr,
              :perception, :initiative, :speed, :ac, :notes, :highlight)
    char = Character.create data
    render json: char
  end

  def destroy
    id = params.require(:id)
    Character.destroy id
    head :no_content
  end
end
