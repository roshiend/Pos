class Vendor < ApplicationRecord
    has_many :products
    has_many :variants, through: :products
    #belongs_to :shop_location
end
