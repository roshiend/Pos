class OptionValue < ApplicationRecord
  belongs_to :option_type
  has_many :option_value_variants, dependent: :destroy
  has_many :variants, through: :option_value_variants
  has_many :products, through: :option_type

  validates_uniqueness_of :name, scope: :option_type_id, case_sensitive: true
  validates :name, presence: true

  before_create :set_initial_position
  before_update :assign_position_on_update
  after_destroy :rearrange_positions

  private

  def set_initial_position
    max_position = option_type.option_values.maximum(:position) || 0
    self.position = max_position + 1
  end

  def assign_position_on_update
    if self.position_changed? && self.position.present?
      old_position = self.position_was
      new_position = self.position

      if new_position < old_position
        option_type.option_values.where.not(id: self.id)
                                 .where(position: new_position...old_position)
                                 .update_all("position = position + 1")
      elsif new_position > old_position
        option_type.option_values.where.not(id: self.id)
                                 .where(position: (old_position + 1)..new_position)
                                 .update_all("position = position - 1")
      end
    end
  end

  def rearrange_positions
    option_type.option_values.where("position > ?", self.position).update_all("position = position - 1")
  end
end
