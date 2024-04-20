class Product < ApplicationRecord
    has_many :option_types, dependent: :destroy
    has_many :variants, dependent: :destroy
    has_rich_text :description
    validates :name, presence: true
    validates :description, presence: true

    accepts_nested_attributes_for :option_types, allow_destroy: true
    accepts_nested_attributes_for :variants, allow_destroy: true

    after_save :update_or_create_variants

    private
  
    def update_or_create_variants
      # Assuming you'll revise this to work with ID combinations directly:
      option_value_combinations = prepare_option_value_combinations
  
      ActiveRecord::Base.transaction do
        create_unique_variants(option_value_combinations)
      end
    end
  
    def prepare_option_value_combinations
      combinations = []
      self.option_types.each do |option_type|
        current_combination = []
        option_type.option_values.each do |option_value|
          current_combination.push(option_value.id)
        end
        combinations.push(current_combination) unless current_combination.empty?
      end
      combinations
    end
  
    def create_unique_variants(combinations)
      current_variants = self.variants.includes(:option_values)
  
      current_variant_map = current_variants.each_with_object({}) do |variant, map|
        key = variant.option_values.pluck(:id).sort
        map[key] = variant
      end
  
      combinations.each do |combination_ids|
        sorted_ids = combination_ids.sort
        existing_variant = current_variant_map[sorted_ids]
  
        if existing_variant
          # Update existing variant if needed
        else
          # Create a new variant
          new_variant = self.variants.create!(price: master_price)
          sorted_ids.each do |id|
            new_variant.option_value_variants.create!(option_value_id: id)
          end
        end
  
        current_variant_map.delete(sorted_ids)
      end
  
      # Cleanup: destroy variants not included in the update
      current_variant_map.values.each(&:destroy)
    end
      
    

      
      


end

