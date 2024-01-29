class Variant < ApplicationRecord
  belongs_to :product
  #has_many :Option_value_variants
  #validates :option_id, presence: true
  #validates :option_values, presence: true
  validates :sku, presence: true
  validates :price, presence: true
end
