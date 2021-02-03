require 'rails_helper'

RSpec.describe 'CasterClasses routes' do
  it 'routes #confirm_delete' do
    expect(get: 'classes/18/confirm/delete')
      .to route_to(controller: 'caster_classes', action: 'confirm_delete', id: '18')
  end

  it 'routes #create' do
    expect(post: 'classes')
      .to route_to(controller: 'caster_classes', action: 'create')
  end

  it 'routes #destroy' do
    expect(delete: 'classes/18')
      .to route_to(controller: 'caster_classes', action: 'destroy', id: '18')
  end

  it 'routes #edit' do
    expect(get: 'classes/18/edit')
      .to route_to(controller: 'caster_classes', action: 'edit', id: '18')
  end

  it 'routes #index' do
    expect(get: caster_classes_path)
      .to route_to(controller: 'caster_classes', action: 'index')
    expect(get: 'classes')
      .to route_to(controller: 'caster_classes', action: 'index')
  end

  it 'routes #list' do
    expect(get: 'classes/list')
      .to route_to(controller: 'caster_classes', action: 'list')
  end

  it 'routes #new' do
    expect(get: 'classes/new')
      .to route_to(controller: 'caster_classes', action: 'new')
  end

  it 'does not route #show' do
    expect(get: 'classes/18').not_to be_routable
  end

  it 'routes #spells' do
    expect(get: caster_class_spells_path(18))
      .to route_to(controller: 'caster_classes', action: 'spells', id: '18')
    expect(get: 'classes/18/spells')
      .to route_to(controller: 'caster_classes', action: 'spells', id: '18')
  end

  it 'routes #update' do
    expect(put: 'classes/18')
      .to route_to(controller: 'caster_classes', action: 'update', id: '18')
    expect(patch: 'classes/18')
      .to route_to(controller: 'caster_classes', action: 'update', id: '18')
  end

  it 'routes #update_spells' do
    expect(post: 'classes/18/spells')
      .to route_to(controller: 'caster_classes', action: 'update_spells', id: '18')
  end
end
