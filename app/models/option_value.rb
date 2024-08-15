class OptionValue < ApplicationRecord
    belongs_to :option_type
    has_many :option_value_variants, dependent: :destroy
    has_many :variants, through: :option_value_variants
    has_many :products, through: :option_types
  
    
    validates_uniqueness_of :name, scope: :option_type_id, case_sensitive: true
    validates :name, presence: true

    # def name=(value)
    #   super(value.is_a?(Array) ? value.join(', ') : value)
    # end

  end
  