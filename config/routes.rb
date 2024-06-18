Rails.application.routes.draw do
  resources :option_value_variants
  resources :variants
  resources :option_value_sets
  resources :option_type_sets
  resources :products do
    resources :option_types  do
      resources :option_values
    end
  end 

  resources :variants 
  

  
  
 
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   root "products#new"
   post 'create_variants', to: 'products#create_variants'
end
