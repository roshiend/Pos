class Vendor < ApplicationRecord
    has_many :products
    has_many :variants, through: :products
end
