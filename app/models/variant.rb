class Variant < ApplicationRecord
  belongs_to :product
  has_many :option_types, through: :product

  validates :sku, presence: true, uniqueness: { scope: :product_id }
  #validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  before_validation :set_title
  before_create :set_unique_id
  before_create :set_initial_position
  before_update :assign_position_on_update
  before_destroy :rearrange_positions

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

  before_save do
    self.price ||= product.master_price
    
  end
  
  def set_initial_position
    max_position = product.variants.maximum(:position) || 0
    self.position = max_position + 1
  end

  def assign_position_on_update
    if self.position_changed? && self.position.present?
      old_position = self.position_was
      new_position = self.position

      if new_position < old_position
        product.variants.where.not(id: self.id)
                            .where(position: new_position...old_position)
                            .update_all("position = position + 1")
      elsif new_position > old_position
        product.variants.where.not(id: self.id)
                            .where(position: (old_position + 1)..new_position)
                            .update_all("position = position - 1")
      end
    end
  end

  def rearrange_positions
    product.variants.where('position > ?', self.position).update_all('position = position - 1')
  end

end

 

 

  