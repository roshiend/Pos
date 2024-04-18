class OptionTypeSet < ApplicationRecord
    has_many :option_value_sets
    accepts_nested_attributes_for :option_value_sets, allow_destroy: true
end
