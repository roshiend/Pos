class ProductOptionTypeValue < ApplicationRecord
    belongs_to :product, optional: false
    #belongs_to :option_type, optional: false
    has_many :option_value_variants
end
