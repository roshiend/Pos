class OptionType < ApplicationRecord
    belongs_to :product
    has_many :option_values, dependent: :destroy

   accepts_nested_attributes_for :option_values, allow_destroy: true
end

