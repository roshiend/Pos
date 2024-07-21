
class Product < ApplicationRecord
    belongs_to :vendor
    has_many :option_types, dependent: :destroy
    has_many :variants, dependent: :destroy
    has_many :option_values, through: :option_types
    has_rich_text :description
    validates :name, presence: true
    validates :description, presence: true

    accepts_nested_attributes_for :option_types, allow_destroy: true
    accepts_nested_attributes_for :variants, allow_destroy: true
    #
    # after_save :generate_variants
    
    #before_save :compact_options

    
    # def generate_variants
    #   option_type_value_groupings = {}
    
    #   # Only proceed if there are option types
    #   if option_types.any?
    #     option_types.each do |option_type|
    #       # Only add to groupings if there are option values
    #       if option_type.option_values.any?
    #         option_type_value_groupings[option_type.id] =
    #           option_type.option_values.map(&:id)
    #       end
    #     end
    
    #     # Only proceed if there are groupings
    #     if option_type_value_groupings.any?
    #       all_value_ids = option_type_value_groupings.values
    
    #       # Generate all combinations of value ids
    #       all_value_ids =
    #         all_value_ids.inject(all_value_ids.shift) do |memo, value|
    #           memo.product(value).map(&:flatten)
    #         end
    
    #       Create variants for each combination of value ids
    #       all_value_ids.each do |value_ids|
    #         variants.create(option_value_ids: value_ids)
    #       end
    #     end
    #   end
    # end
    
    before_save :check_option_types

  private

  def check_option_types
    self.option_types.each do |option_type|
      if option_type.option_values.empty? || option_type.option_values.all? { |ov| ov.marked_for_destruction? }
        option_type.mark_for_destruction
      end
    end
  end
    
    
      
      
    
      
     


    
    




end




