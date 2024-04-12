class OptionValue < ApplicationRecord
    belongs_to :option_type
    #has_many :option_value_variants, dependent: :destroy
    #has_many :variants, through: :option_value_variants
    #has_many :product_option_type_values,dependent: :destroy

    #accepts_nested_attributes_for :option_value_variants, allow_destroy: true,:reject_if => :all_blank
end
