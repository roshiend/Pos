class OptionValue < ApplicationRecord
    belongs_to :option_type
    has_many :option_value_variants, dependent: :destroy
    has_many :variants, through: :option_value_variants
    has_many :products, through: :option_types
  
    validates_presence_of :name
    validates_uniqueness_of :name, scope: :option_type_id, case_sensitive: true
  end
  