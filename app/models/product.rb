class Product < ApplicationRecord
    has_many :product_option_type_values, dependent: :destroy
    has_many :option_value_variants, through: :product_option_type_values
    has_many :variants, dependent: :destroy
    accepts_nested_attributes_for :product_option_type_values, allow_destroy: true,:reject_if => :all_blank

    has_rich_text :description
    validates :name, presence: true
    
    def generate_variants
      option_type_value_groupings = {}
  
      # Mapping option type IDs to their option value arrays
      product_option_type_values.each do |option|
        option_type_value_groupings[option.product_option_name] ||= []
        option_type_value_groupings[option.product_option_name] += option.product_option_values
      end
  
      # Ensure each element in option_type_value_groupings is an array of arrays
      all_value_combinations = option_type_value_groupings.values
  
      # Check if all_value_combinations is correctly structured
      # It should be an array of arrays before applying product
      if all_value_combinations.all? { |element| element.is_a?(Array) }
        # Compute all combinations of option values using product
        combinations = all_value_combinations.shift.product(*all_value_combinations).map(&:flatten)
        
        ActiveRecord::Base.transaction do
          combinations.each do |combination|
            variant = variants.create!(price: master_price)  # Adjust attributes as necessary
            combination.each do |value_id|
              # Assuming there is a model or method to handle linking variant with the value_id
              variant.option_value_variants.create!(product_option_type_value_id: value_id)
            end
          end
        end
      else
        # Log or handle the case where combinations cannot be made
        puts "Error: Invalid data structure for combinations."
      end
    end
  
    

end
