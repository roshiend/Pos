class Variant < ApplicationRecord
  belongs_to :product
  has_many :option_types, through: :product

  validates :sku, presence: true, uniqueness: { scope: :product_id }
  #validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  before_validation :set_title
  before_create :set_unique_id

  private

  def set_unique_id
    retry_count = 0
    begin
      self.unique_id = SecureRandom.uuid
      retry_count += 1
    end while Variant.exists?(unique_id: unique_id) && retry_count < 10

    if retry_count == 10
      errors.add(:unique_id, "could not generate a unique identifier.")
      throw(:abort)
    end
  end

  def set_title
    self.title ||= generate_title
  end

  def generate_title
    if option1.present? || option2.present? || option3.present?
      [option1, option2, option3].compact.join(' / ')
    else
      'Default'
    end
  end
end
