Rails.application.routes.draw do
  resources :variants
  resources :product_options
  resources :products do
    post 'create_variants', on: :collection
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   root "products#new"
end
