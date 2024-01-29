class Product < ApplicationRecord
    has_rich_text :description
    validates :name, presence: true
    validates :description, presence: true
    has_many :product_options, dependent: :destroy
    has_many :variants, dependent: :destroy
    accepts_nested_attributes_for :variants, allow_destroy: true,:reject_if => :all_blank
    accepts_nested_attributes_for :product_options, allow_destroy: true ,:reject_if => :all_blank
end
