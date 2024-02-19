class Combination < ApplicationRecord
    belongs_to :product
    belongs_to :variant

    before_save :assign_product_id
    before_save :assign_variant_id
end
