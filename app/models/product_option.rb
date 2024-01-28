class ProductOption < ApplicationRecord
    belongs_to :product, optional: true
    
end
