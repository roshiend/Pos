class OptionType < ApplicationRecord
    #has_many :product_option_type_values, dependent: :destroy
    has_many :option_values, dependent: :destroy
    #has_many :products, through: :product_option_type_value

    accepts_nested_attributes_for :option_values, allow_destroy: true,:reject_if => :all_blank
end
