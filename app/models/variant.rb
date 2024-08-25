class Variant < ApplicationRecord
  belongs_to :product, optional: false
  #belongs_to :shop_location
  has_many :option_types, through: :product

  
  validates :sku, presence: true, uniqueness: { scope: :product_id }
  #validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
 

  # Ensure unique_id is set before creating the record
  before_create :set_unique_id
  before_validation :set_title

  private

  def set_unique_id
      # Loop until a unique ID is generated
      loop do
      self.unique_id = SecureRandom.uuid
      break unless Variant.exists?(unique_id: unique_id)
      end
  end
 
  
  before_save do
    self.price ||= product.master_price
    
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
