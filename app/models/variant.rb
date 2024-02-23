class Variant < ApplicationRecord
    require 'securerandom'
    belongs_to :product
    has_many :combinations, dependent: :destroy
    accepts_nested_attributes_for :combinations, allow_destroy: true,:reject_if => :all_blank

    before_save :generate_unique_id
    after_save :save_combination
    
  def generate_unique_id
    self.unique_id ||= SecureRandom.uuid
  end
  def save_combination
    combinations.each do |combination_data|
      combination = Combination.new(option_combination: combination_data, product: product, variant: self)
      combination.save
    end
  end
  
end
