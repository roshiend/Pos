class OptionValueVariant < ApplicationRecord
  belongs_to :variant
  belongs_to :product_option_type_value
  validates :product_option_type_value, presence: true
end
