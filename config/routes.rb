Rails.application.routes.draw do
  root to: 'spells#index'

  get 'ajax/spells/caster_edit/:id', to: 'spells#ajax_caster_edit'
  get 'ajax/spells/detail', to: 'spells#ajax_markdown'

  resources :characters, except: [:show]
  get 'characters/list'
  get 'characters/:id/confirm/delete', to: 'characters#confirm_delete'

  resources :classes, except: [:show], controller: 'caster_classes', as: 'caster_classes'
  get 'classes/list', to: 'caster_classes#list'
  get 'classes/:id/confirm/delete', to: 'caster_classes#confirm_delete'

  get 'combat', to: 'combatants#index', as: 'combat'
  resources :combatants, except: [:index, :show]
  get 'combatants/list'
  post 'combatants/:id/activate', to: 'combatants#activate'
  post 'combatants/clear'

  resources :spells, only: [:index, :edit, :update]
  get 'spells/list'
end
