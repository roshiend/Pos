
class Product < ApplicationRecord
    belongs_to :vendor
    belongs_to :product_type
    belongs_to :shop_location
    belongs_to :category,optional: true
    belongs_to :listing_type

    has_many :option_types, dependent: :destroy
    has_many :variants, dependent: :destroy
    has_many :sub_categories, through: :category
    
    has_rich_text :description
    validates :name,:vendor,:shop_location,:listing_type, presence: true
    validates :description, presence: true

    accepts_nested_attributes_for :option_types, allow_destroy: true
    accepts_nested_attributes_for :variants, allow_destroy: true
  
    before_save :check_option_types
  
  private

  def check_option_types
    self.option_types.each do |option_type|
      if option_type.name.blank? || option_type.value.blank? || option_type.value.all? { |v| v.blank? }
        option_type.mark_for_destruction
      end
    end
  end

end




