
class Product < ApplicationRecord
    has_many :option_types, dependent: :destroy
    has_many :variants, dependent: :destroy
    has_many :option_values, through: :option_types
    has_rich_text :description
    validates :name, presence: true
    validates :description, presence: true

    accepts_nested_attributes_for :option_types, allow_destroy: true
    #after_save :save_each_option_array_value_to_seperate_record
     after_save :generate_variants
    
    # def update_or_create_variants
    #     option_value_combinations = self.generate_combinations
    #     ActiveRecord::Base.transaction do
    #         create_unique_variants(option_value_combinations)
    #     end
    # end
   

   
    




    # def self.generate_combinations(option_type_attributes)
    #     return [] if option_type_attributes.blank?
    
    #     combinations = []
    
    #     option_type_attributes.each do |_, option_type_data|
    #       option_values_attributes = option_type_data["option_values_attributes"]
    #       next if option_values_attributes.blank?
    
    #       current_combination = option_values_attributes.values.map { |option_value_data| option_value_data["name"] }.flatten
    
    #       if combinations.empty?
    #         combinations = current_combination.map { |value| [value] } # Ensure combinations is an array of arrays
    #       else
    #         combinations = combinations.product(current_combination).map(&:flatten)
    #       end
    #     end
    
    #     combinations
    #     puts "combinations---->#{combinations}"
    #     # combinations.each do |c|
    #     #    Variant.create(option_value_variants: c)
    #     #  end
    # end

   

    # def create_unique_variants(combinations)
    #     current_variants = self.variants.includes(:option_values)
    
    #     current_variant_map = current_variants.each_with_object({}) do |variant, map|
    #       key = variant.option_values.pluck(:id).sort
    #       map[key] = variant
    #     end
    
    #     combinations.each do |combination_ids|
    #       sorted_ids = combination_ids.sort
    #       existing_variant = current_variant_map[sorted_ids]
    
    #       if existing_variant
    #         # Update existing variant if needed
    #       else
    #         # Create a new variant
    #         #new_variant = self.variants.create!(price: master_price)
    #         new_variant = self.variants.build(price: master_price)
    #         sorted_ids.each do |id|
    #           new_variant.option_value_variants.create!(option_value_id: id)
    #           #new_variant.option_value_variants.build(option_value_id: id)
    #         end
    #       end
  
    #       current_variant_map.delete(sorted_ids)
    #     end
  
    #     # Cleanup: destroy variants not included in the update
    #     current_variant_map.values.each(&:destroy)
    #     #current_variant_map.values.each(mark_for_destruction)
    # end

    # def generate_variants(option_type_attributes)
    #     return if option_type_attributes.blank?
      
    #     option_type_value_groupings = {}
      
    #     option_type_attributes.each do |_, option_type_data|
    #       option_values_attributes = option_type_data["option_values_attributes"]
    #       next if option_values_attributes.blank?
      
    #       option_type_id = option_type_data["id"]
    #       option_type_value_groupings[option_type_id] = option_values_attributes.values.map { |value_data| value_data["id"] }
    #     end
      
    #     all_value_ids = option_type_value_groupings.values
    #     all_value_ids = all_value_ids.inject(all_value_ids.shift) do |memo, value|
    #       memo.product(value).map(&:flatten)
    #     end
      
    #     all_value_ids.each do |value_ids|
    #       variants.create(option_value_ids: value_ids, price: master.price)
    #     end
    # end
      

    # def generate_variants
    #   option_type_value_groupings = {}
  
    #   option_types.each do |option_type|
    #     option_type_value_groupings[option_type.id] =
    #       option_type.option_values.map(&:id)
    #   end
  
    #   all_value_ids = option_type_value_groupings.values
    #   all_value_ids =
    #     all_value_ids.inject(all_value_ids.shift) do |memo, value|
    #       memo.product(value).map(&:flatten)
    #   end
  
    #   all_value_ids.each do |value_ids|
    #     variants.create(option_value_ids: value_ids, price: master_price)
    #   end
    # end

    # def self.generate_variants(option_type_attributes)
    #   option_type_value_groupings = {}
    
    #   option_type_attributes.each do |_, option_type_data|
    #     option_values_attributes = option_type_data["option_values_attributes"]
    #     next if option_values_attributes.blank?
      
    #     option_type_id = option_type_data["id"]
    #     option_type_value_groupings[option_type_id] = option_values_attributes.values.map { |value_data| value_data["name"] }
    #   end
    
    #   all_value_ids = option_type_value_groupings.values
    #   all_value_ids =
    #     all_value_ids.inject(all_value_ids.shift) do |memo, value|
    #       memo.product(value).map(&:flatten)
    #   end
    
    #   all_value_ids.each do |value_ids|
    #     self.variants.build(option_value_ids: value_ids, price: master_price)
    #   end
    # end
    
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




