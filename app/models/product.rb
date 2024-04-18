class Product < ApplicationRecord
    has_many :option_types, dependent: :destroy
    has_many :variants, dependent: :destroy
    has_rich_text :description
    validates :name, presence: true
    validates :description, presence: true

    accepts_nested_attributes_for :option_types, allow_destroy: true
    accepts_nested_attributes_for :variants, allow_destroy: true

    def generate_variants
        option_type_value_groupings = {}
    
        option_types.each do |option_type|
          option_type_value_groupings[option_type.id] =
            option_type.option_values.map(&:id)
        end
    
        all_value_ids = option_type_value_groupings.values
        all_value_ids =
          all_value_ids.inject(all_value_ids.shift) do |memo, value|
            memo.product(value).map(&:flatten)
        end
    
        all_value_ids.each do |value_ids|
          variants.create(option_value_ids: value_ids, price: master_price)
        end
      end
      
      
      
      


end

