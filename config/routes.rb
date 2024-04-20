Rails.application.routes.draw do
  resources :option_value_variants
  resources :variants
  resources :option_values
  resources :option_types
  resources :option_value_sets
  resources :option_type_sets
  resources :products
  resources :option_types, only: [:index] do
    resources :option_values, only: [:index]
  end
  #resources :variants
  resources :products do
    post 'create_variants', on: :collection
    member do
      get :update_variants
    end
    
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   root "products#new"
end
