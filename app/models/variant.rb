class Variant < ApplicationRecord
    belongs_to :product
    has_many :option_value_variants, dependent: :destroy
    #has_many :option_values, through: :option_value_variants

    accepts_nested_attributes_for :option_value_variants, allow_destroy: true,:reject_if => :all_blank
end
