class SpellsController < ApplicationController
  before_action :load_spell, only: [:show, :edit, :update]

  def index; end

  def ajax_index
    searches = params.require('spell')
      .permit(['utf8', 'sort_by_level', { 'caster_class_ids' => [], 'school_id' => [],
               'level' => [], 'cast_unit' => [], 'ritual' => [], 'range_unit' => [],
               'components' => [], 'duration_unit' => [], 'concentration' => [] }])

    searches.delete('utf8')

    if searches.delete('sort_by_level') == '1'
      by_level = true
      sorts = [:level, :name]
    else
      by_level = false
      sorts = [:name]
    end

    if searches.key? 'components'
      searches['components'].include?('1') &&
        !searches['components'].include?('2') &&
        searches['components'] << '2'

      searches['components'] = searches['components'].reduce(0) { |x, y| x + y.to_i }
    end

    class_ids = searches.delete 'caster_class_ids'
    searches['caster_classes'] = { id: class_ids } if class_ids&.any?

    @spells = Spell.includes(:caster_classes).where(searches).order(sorts)

    render layout: nil, locals: { bylevel: by_level, filters: searches }
  end

  def ajax_caster_edit
    caster_id = params.require :id
    @caster = CasterClass.find(caster_id)
    @spells = Spell.order(:level, :name).all
    respond_to do |fmt|
      fmt.html { render layout: nil }
      fmt.json { render json: @spells }
    end
  end

  def ajax_markdown
    require 'redcarpet'

    filename = params.require :name
    filename = "#{Rails.root}/public/spells/#{filename}.md"
    begin
      markdown = File.read(filename)
    rescue Errno::ENOENT
      Rails.logger.error "Failed to load #{filename}"
      render html: '', status: 404
      return
    end
    render md: markdown
  end

  def show; end

  def edit; end

  def update
    data = params.require(:edit_spell)
      .permit(:name, :level, :school_id,
              :cast_n, :cast_unit, :ritual,
              :range_n, :range_unit,
              :duration_n, :duration_unit, :concentration,
              :somatic, :verbal, :material, :focus)

    [:cast_n, :range_n, :duration_n].each do |f|
      data[f] = nil unless data[f].present?
    end

    data[:material] = true if data[:focus] == true

    @spell.update(data)

    render json: @spell, status: :ok
  end

  private

  def load_spell
    id = params.require :id
    @spell = Spell.find id
  end
end
