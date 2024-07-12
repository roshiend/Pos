class Variant < ApplicationRecord
  belongs_to :product, optional: true
  has_many :option_value_variants, dependent: :destroy
  has_many :option_values, through: :option_value_variants

  accepts_nested_attributes_for :option_value_variants, allow_destroy: true

  validate :uniqueness_of_option_values

  private

  def uniqueness_of_option_values
    existing_variants = product.variants.includes(:option_values)
    existing_combinations = existing_variants.map { |variant| variant.option_values.pluck(:id).sort }

    if existing_combinations.include?(option_value_ids.sort)
      errors.add(:base, 'Combination of option values already exists')
    end
  end
end
