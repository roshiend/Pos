Rails.application.routes.draw do
  resources :listing_types
  resources :shop_locations
  resources :sub_catogories
  
  resources :product_types
  resources :vendors
  
  resources :variants
  resources :option_value_sets
  resources :option_type_sets
  resources :products do
    resources :option_types 
  end 

  resources :variants 
  resources :vendors, only: [] do
    member do
      get :code
    end
  end
  resources :categories do
    get :sub_categories, on: :member
  end

  
  
 
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   root "products#new"
   post 'create_variants', to: 'products#create_variants'
end
