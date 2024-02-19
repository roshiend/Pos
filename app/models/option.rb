class Option < ApplicationRecord
    has_many :option_values, dependent: :destroy
    accepts_nested_attributes_for :option_values, allow_destroy: true,:reject_if => :all_blank
end
