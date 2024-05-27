Rails.application.routes.draw do
  resources :option_value_variants
  resources :variants
  resources :option_value_sets
  resources :option_type_sets
  resources :products do
  resources :option_types, only: [:index] do
    resources :option_values, only: [:index]
    end
  end 

  resources :variants 
    
  
  resources :products do
   # post 'create_variants', on: :collection
    
    
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   root "products#new"
   post 'create_variants', to: 'products#create_variants'
end
