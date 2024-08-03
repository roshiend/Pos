class SubCategory < ApplicationRecord
    belongs_to :category
    has_many :products, through: :category
end
