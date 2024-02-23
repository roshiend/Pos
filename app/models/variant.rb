class Variant < ApplicationRecord
    require 'securerandom'
    belongs_to :product
    has_many :combinations, dependent: :destroy
    accepts_nested_attributes_for :combinations, allow_destroy: true,:reject_if => :all_blank

    before_save :generate_unique_id
    
    
  def generate_unique_id
    self.unique_id ||= SecureRandom.uuid
  end
  
  
end
