class ProductOption < ApplicationRecord
    belongs_to :product, optional: true
    #has_many :variants, dependent: :destroy
  
    validates :product_option_name, presence: true, uniqueness: { scope: :product_id }
    validates :product_option_values, presence: true
  
  
    
end
