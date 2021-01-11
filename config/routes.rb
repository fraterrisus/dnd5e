Rails.application.routes.draw do
  root to: 'spells#index'

  get 'ajax/spells/index', to: 'spells#ajax_index'
  get 'ajax/spells/caster_edit/:id', to: 'spells#ajax_caster_edit'
  get 'ajax/spells/detail', to: 'spells#ajax_markdown'
  get 'ajax/classes/index', to: 'caster_classes#ajax_index', as: 'ajax_classes'
  get 'ajax/characters/index', to: 'characters#ajax_index'

  resources :characters
  resources :classes, controller: 'caster_classes', as: 'caster_classes',
    only: [:index, :create, :new, :edit, :update]

  get 'combat', to: 'combatants#initiative', as: 'combat'

  resources :combatants do
    post 'activate'
  end

  post 'combatants/clear'

  resources :spells, only: [:index, :show, :update]
end
