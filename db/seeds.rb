# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
# db/seeds.rb

# Option: Color
color_option = OptionTypeSet.find_or_create_by(name: 'Color')

# Option Values for Color
color_option.option_value_sets.find_or_create_by(value: 'Red')
color_option.option_value_sets.find_or_create_by(value: 'Blue')
color_option.option_value_sets.find_or_create_by(value: 'Green')
color_option.option_value_sets.find_or_create_by(value: 'Yellow')
color_option.option_value_sets.find_or_create_by(value: 'Orange')
color_option.option_value_sets.find_or_create_by(value: 'Purple')
color_option.option_value_sets.find_or_create_by(value: 'Black')
color_option.option_value_sets.find_or_create_by(value: 'White')

# Option: Size
size_option = OptionTypeSet.find_or_create_by(name: 'Size')

# Option Values for Size
size_option.option_value_sets.find_or_create_by(value: 'Small')
size_option.option_value_sets.find_or_create_by(value: 'Medium')
size_option.option_value_sets.find_or_create_by(value: 'Large')
size_option.option_value_sets.find_or_create_by(value: 'Extra Large')

# Option: Material
material_option = OptionTypeSet.find_or_create_by(name: 'Material')

# Option Values for Material
material_option.option_value_sets.find_or_create_by(value: 'Cotton')
material_option.option_value_sets.find_or_create_by(value: 'Leather')
material_option.option_value_sets.find_or_create_by(value: 'Wool')
material_option.option_value_sets.find_or_create_by(value: 'Silk')
material_option.option_value_sets.find_or_create_by(value: 'Denim')
material_option.option_value_sets.find_or_create_by(value: 'Synthetic')

# Option: Flavor
flavor_option = OptionTypeSet.find_or_create_by(name: 'Flavor')

# Option Values for Flavor
flavor_option.option_value_sets.find_or_create_by(value: 'Chocolate')
flavor_option.option_value_sets.find_or_create_by(value: 'Vanilla')
flavor_option.option_value_sets.find_or_create_by(value: 'Strawberry')
flavor_option.option_value_sets.find_or_create_by(value: 'Mint')
flavor_option.option_value_sets.find_or_create_by(value: 'Coffee')
flavor_option.option_value_sets.find_or_create_by(value: 'Caramel')

# Option: Gender
gender_option = OptionTypeSet.find_or_create_by(name: 'Gender')

# Option Values for Gender
gender_option.option_value_sets.find_or_create_by(value: 'Male')
gender_option.option_value_sets.find_or_create_by(value: 'Female')
gender_option.option_value_sets.find_or_create_by(value: 'Unisex')