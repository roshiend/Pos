class Variant < ApplicationRecord
  belongs_to :product, optional: false
  #belongs_to :shop_location
  has_many :option_value_variants, dependent: :destroy
  has_many :option_values, through: :option_value_variants

  accepts_nested_attributes_for :option_value_variants, allow_destroy: true

  # Ensure unique_id is set before creating the record
  before_create :set_unique_id

  private

  def set_unique_id
      # Loop until a unique ID is generated
      loop do
      self.unique_id = SecureRandom.uuid
      break unless Variant.exists?(unique_id: unique_id)
      end
  end
 
end
