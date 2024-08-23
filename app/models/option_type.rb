class OptionType < ApplicationRecord
    belongs_to :product, optional: false
    has_many :option_values, dependent: :destroy
    accepts_nested_attributes_for :option_values, allow_destroy: true
  
    
    before_create :set_initial_position
    before_update :assign_position_on_update
    before_destroy :rearrange_positions
  
    private
  
    def set_initial_position
      max_position = product.option_types.maximum(:position) || 0
      self.position = max_position + 1
    end

    def assign_position_on_update
        if self.position_changed? && self.position.present?
          old_position = self.position_was
          new_position = self.position
    
          if new_position < old_position
            product.option_types.where.not(id: self.id)
                                     .where(position: new_position...old_position)
                                     .update_all("position = position + 1")
          elsif new_position > old_position
            product.option_types.where.not(id: self.id)
                                     .where(position: (old_position + 1)..new_position)
                                     .update_all("position = position - 1")
          end
        end
    end

    def rearrange_positions
      product.option_types.where('position > ?', self.position).update_all('position = position - 1')
    end
  end
  
 