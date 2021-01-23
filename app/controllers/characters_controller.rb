class CharactersController < ApplicationController
  before_action :load_character, only: [:edit, :confirm_delete, :update]

  def index
    respond_to do |fmt|
      fmt.json { redirect_to action: :list, format: :json }
      fmt.html
    end
  end

  def create
    data = params.require(:character)
      .permit(:name, :str, :dex, :con, :int, :wis, :chr,
              :perception, :initiative, :speed, :ac, :notes, :highlight)
    char = Character.create data
    render json: char
  end

  def new
    @char = nil
    render :edit, layout: nil
  end

  def edit
    render layout: nil
  end

  def update
    data = params.require(:character)
      .permit(:name, :str, :dex, :con, :int, :wis, :chr,
              :perception, :initiative, :speed, :ac, :notes, :highlight)
    @char.update data
    render json: @char
  end

  def destroy
    id = params.require(:id)
    Character.destroy id
    head :no_content
  end

  def list
    @chars = Character.order(:name).all
    respond_to do |fmt|
      fmt.json { render json: @chars }
      fmt.html { render layout: nil }
    end
  end

  def confirm_delete
    render layout: nil
  end

  private

  def load_character
    id = params.require(:id)
    @char = Character.find id
  end
end
