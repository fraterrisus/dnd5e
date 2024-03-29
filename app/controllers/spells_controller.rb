class SpellsController < ApplicationController
  before_action :load_spell, only: [:edit, :update]

  def index; end

  def show
    require 'redcarpet'

    base_file = params.require :name
    dest_dir = Rails.public_path.join('spells').to_s

    filename = "#{dest_dir}/#{base_file}.md"
    if File.exist?(filename)
      render md: File.read(filename)
      return
    end

    # rubocop:disable Rails/OutputSafety
    # yeah yeah i know
    filename = "#{dest_dir}/#{base_file}.html"
    if File.exist?(filename)
      render html: File.read(filename).html_safe
      return
    end
    # rubocop:enable Rails/OutputSafety

    render html: '', status: :not_found
  end

  def edit; end

  def update
    data = params.require(:edit_spell)
      .permit(:nym, :level, :school_id,
              :cast_n, :cast_unit, :ritual,
              :range_n, :range_unit,
              :duration_n, :duration_unit, :concentration,
              :somatic, :verbal, :material, :focus)

    [:cast_n, :range_n, :duration_n].each do |f|
      data[f] = nil if data[f].blank?
    end

    data[:material] = true if data[:focus] == true

    @spell.update(data)

    render json: @spell, status: :ok
  end

  def list
    filters = params.require('spell')
      .permit(['utf8', 'sort_by_level', { 'caster_class_ids' => [], 'school_id' => [],
               'level' => [], 'cast_unit' => [], 'ritual' => [], 'range_unit' => [],
               'components' => [], 'duration_unit' => [], 'concentration' => [] }])

    filters.delete('utf8')

    if filters.delete('sort_by_level') == '1'
      by_level = true
      sorts = [:level, :nym]
    else
      by_level = false
      sorts = [:nym]
    end

    if filters.key? 'components'
      filters['components'] << '2' if
        filters['components'].include?(1) && filters['components'].exclude?(2)

      filters['components'] = filters['components'].reduce(0) { |x, y| x + y.to_i }
    end

    class_ids = filters.delete 'caster_class_ids'
    filters['caster_classes'] = { id: class_ids } if class_ids&.any?

    @spells = Spell.includes(:caster_classes).where(filters).order(sorts)

    respond_to do |fmt|
      fmt.json { render json: @chars }
      fmt.html { render layout: nil, locals: { by_level:, filters: } }
    end
  end

  private

  def load_spell
    id = params.require :id
    @spell = Spell.find id
  end
end
