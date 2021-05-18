class SpellsController < ApplicationController
  before_action :load_spell, only: [:edit, :update]

  def index; end

  def edit; end

  def update
    data = params.require(:edit_spell)
      .permit(:nym, :level, :school_id,
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

  def show
    require 'redcarpet'

    base_file = params.require :name
    dest_dir = "#{Rails.root}/public/spells"

    filename = "#{dest_dir}/#{base_file}.md"
    if File.exist?(filename)
      render md: File.read(filename)
      return
    end

    filename = "#{dest_dir}/#{base_file}.html"
    if File.exist?(filename)
      render html: File.read(filename).html_safe
      return
    end

    render html: '', status: 404
  end

  def list
    searches = params.require('spell')
      .permit(['utf8', 'sort_by_level', { 'caster_class_ids' => [], 'school_id' => [],
               'level' => [], 'cast_unit' => [], 'ritual' => [], 'range_unit' => [],
               'components' => [], 'duration_unit' => [], 'concentration' => [] }])

    searches.delete('utf8')

    if searches.delete('sort_by_level') == '1'
      by_level = true
      sorts = [:level, :nym]
    else
      by_level = false
      sorts = [:nym]
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

    respond_to do |fmt|
      fmt.json { render json: @chars }
      fmt.html { render layout: nil, locals: { by_level: by_level, filters: searches } }
    end
  end

  private

  def load_spell
    id = params.require :id
    @spell = Spell.find id
  end
end
