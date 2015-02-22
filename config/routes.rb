Rails.application.routes.draw do
  root 'spells#index'

  match 'ajax/spells/index', via: :get, to: 'spells#ajax_index'
  match 'ajax/spells/caster_edit/:id', via: :get, to: 'spells#ajax_caster_edit'
  match 'ajax/spells/detail', via: :get, to: 'spells#ajax_markdown'
  match 'ajax/classes/class_index', via: :get, to: 'caster_classes#ajax_index'
  match 'ajax/characters/index', via: :get, to: 'characters#ajax_index'

  match 'spells', via: :get, to: 'spells#index'
  match 'spells/:id/edit', via: :get, to: 'spells#edit', as: :edit_spell
  match 'spells/:id', via: :get, to: 'spells#show', as: :spell
  match 'spells/:id', via: [ :put, :patch ], to: 'spells#update'

  match 'characters', via: :get, to: 'characters#index'
  match 'characters', via: :post, to: 'characters#create'
  match 'characters/:id', via: [ :put, :patch ], to: 'characters#update'

  match 'classes', via: :get, to: 'caster_classes#index', as: :caster_classes
  match 'classes', via: :post, to: 'caster_classes#create'
  match 'classes/new', via: :get, to: 'caster_classes#new', as: :new_caster_class
  match 'classes/:id', via: :get, to: 'caster_classes#edit', as: :edit_caster_class
  match 'classes/:id', via: [ :put, :patch ], to: 'caster_classes#update'

  match 'combat', via: :get, to: 'combatants#initiative', as: :combat

  match 'combatants', via: :get, to: 'combatants#index'
  match 'combatants', via: :post, to: 'combatants#create'
  match 'combatants/last_update', via: :get
  match 'combatants/clear', via: :get, as: 'clear_combatants'
  match 'combatants/:id', via: [ :put, :patch ], to: 'combatants#update'

  match 'dice', via: :get, to: 'dice#index', as: :dice
end
