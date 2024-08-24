class Variant < ApplicationRecord
  belongs_to :product, optional: false
  #belongs_to :shop_location
  has_many :option_types, through: :product

  validate :options

 

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
 
  def options
    [option1, option2, option3].compact.empty?
  end

  before_save do
    self.price ||= product.master_price
    
  end
   
 

 
end
