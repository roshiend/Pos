# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
# db/seeds.rb
# Define a method to generate incrementing codes
# Initialize the starting codes
category_code = 0001
subcategory_code = 000001

# Helper methods to generate codes
def generate_category_code(code)
  code.to_s.rjust(4, '0')
end

def generate_subcategory_code(code)
  code.to_s.rjust(6, '0')
end


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

#vendors
vendor_name = Vendor.find_or_create_by(name: 'Jhonson', code: "JH001")
vendor_name = Vendor.find_or_create_by(name: 'Imran', code: "IM001")
vendor_name = Vendor.find_or_create_by(name: 'Suresh', code: "SU001")

# Product Types
clothing = ProductType.find_or_create_by(name: 'Clothing', code: "001")
electronics = ProductType.find_or_create_by(name: 'Electronics', code: "002")
home_decor = ProductType.find_or_create_by(name: 'Home decor', code: "003")
beauty = ProductType.find_or_create_by(name: 'Beauty', code: "004")
shoes = ProductType.find_or_create_by(name: 'Shoes', code: "005")
jewelry = ProductType.find_or_create_by(name: 'Jewelry', code: "006")
toys = ProductType.find_or_create_by(name: 'Toys', code: "007")
books = ProductType.find_or_create_by(name: 'Books', code: "008")
appliances = ProductType.find_or_create_by(name: 'Appliances', code: "009")

# Categories and Subcategories

# Clothing
mens_clothing = clothing.categories.find_or_create_by(value: 'Men’s clothing', code: generate_category_code(category_code))
category_code += 1
mens_clothing.sub_categories.find_or_create_by(value: 'Suits', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
mens_clothing.sub_categories.find_or_create_by(value: 'Shirts', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
mens_clothing.sub_categories.find_or_create_by(value: 'Pants', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

womens_clothing = clothing.categories.find_or_create_by(value: 'Women’s clothing', code: generate_category_code(category_code))
category_code += 1
womens_clothing.sub_categories.find_or_create_by(value: 'Dresses', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
womens_clothing.sub_categories.find_or_create_by(value: 'Blouses', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
womens_clothing.sub_categories.find_or_create_by(value: 'Skirts', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

childrens_clothing = clothing.categories.find_or_create_by(value: 'Children’s clothing', code: generate_category_code(category_code))
category_code += 1
childrens_clothing.sub_categories.find_or_create_by(value: 'T-Shirts', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
childrens_clothing.sub_categories.find_or_create_by(value: 'Shorts', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
childrens_clothing.sub_categories.find_or_create_by(value: 'Jackets', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

accessories_clothing = clothing.categories.find_or_create_by(value: 'Accessories', code: generate_category_code(category_code))
category_code += 1
accessories_clothing.sub_categories.find_or_create_by(value: 'Belts', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
accessories_clothing.sub_categories.find_or_create_by(value: 'Hats', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
accessories_clothing.sub_categories.find_or_create_by(value: 'Scarves', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Electronics
gadgets = electronics.categories.find_or_create_by(value: 'Gadgets', code: generate_category_code(category_code))
category_code += 1
gadgets.sub_categories.find_or_create_by(value: 'Smartwatches', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
gadgets.sub_categories.find_or_create_by(value: 'VR Headsets', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

phones = electronics.categories.find_or_create_by(value: 'Phones', code: generate_category_code(category_code))
category_code += 1
phones.sub_categories.find_or_create_by(value: 'Smartphones', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
phones.sub_categories.find_or_create_by(value: 'Feature Phones', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

accessories_electronics = electronics.categories.find_or_create_by(value: 'Accessories', code: generate_category_code(category_code))
category_code += 1
accessories_electronics.sub_categories.find_or_create_by(value: 'Chargers', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
accessories_electronics.sub_categories.find_or_create_by(value: 'Earphones', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

phone_covers = electronics.categories.find_or_create_by(value: 'Phones covers', code: generate_category_code(category_code))
category_code += 1
phone_covers.sub_categories.find_or_create_by(value: 'Silicone Cases', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
phone_covers.sub_categories.find_or_create_by(value: 'Leather Cases', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

computers = electronics.categories.find_or_create_by(value: 'Computers', code: generate_category_code(category_code))
category_code += 1
computers.sub_categories.find_or_create_by(value: 'Laptops', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
computers.sub_categories.find_or_create_by(value: 'Desktops', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Home Decor
cushions = home_decor.categories.find_or_create_by(value: 'Cushions', code: generate_category_code(category_code))
category_code += 1
cushions.sub_categories.find_or_create_by(value: 'Decorative Cushions', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
cushions.sub_categories.find_or_create_by(value: 'Floor Cushions', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

lamps = home_decor.categories.find_or_create_by(value: 'Lamps', code: generate_category_code(category_code))
category_code += 1
lamps.sub_categories.find_or_create_by(value: 'Table Lamps', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
lamps.sub_categories.find_or_create_by(value: 'Floor Lamps', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

wall_art = home_decor.categories.find_or_create_by(value: 'Wall art', code: generate_category_code(category_code))
category_code += 1
wall_art.sub_categories.find_or_create_by(value: 'Paintings', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
wall_art.sub_categories.find_or_create_by(value: 'Posters', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Beauty
skincare = beauty.categories.find_or_create_by(value: 'Skincare', code: generate_category_code(category_code))
category_code += 1
skincare.sub_categories.find_or_create_by(value: 'Moisturizers', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
skincare.sub_categories.find_or_create_by(value: 'Cleansers', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

makeup = beauty.categories.find_or_create_by(value: 'Makeup', code: generate_category_code(category_code))
category_code += 1
makeup.sub_categories.find_or_create_by(value: 'Lipsticks', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
makeup.sub_categories.find_or_create_by(value: 'Foundations', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

haircare = beauty.categories.find_or_create_by(value: 'Haircare', code: generate_category_code(category_code))
category_code += 1
haircare.sub_categories.find_or_create_by(value: 'Shampoos', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
haircare.sub_categories.find_or_create_by(value: 'Conditioners', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Shoes
sandals = shoes.categories.find_or_create_by(value: 'Sandals', code: generate_category_code(category_code))
category_code += 1
sandals.sub_categories.find_or_create_by(value: 'Flip Flops', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
sandals.sub_categories.find_or_create_by(value: 'Slides', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

boots = shoes.categories.find_or_create_by(value: 'Boots', code: generate_category_code(category_code))
category_code += 1
boots.sub_categories.find_or_create_by(value: 'Ankle Boots', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
boots.sub_categories.find_or_create_by(value: 'Knee-High Boots', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Jewelry
rings = jewelry.categories.find_or_create_by(value: 'Rings', code: generate_category_code(category_code))
category_code += 1
rings.sub_categories.find_or_create_by(value: 'Wedding Rings', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
rings.sub_categories.find_or_create_by(value: 'Engagement Rings', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

necklaces = jewelry.categories.find_or_create_by(value: 'Necklaces', code: generate_category_code(category_code))
category_code += 1
necklaces.sub_categories.find_or_create_by(value: 'Chokers', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
necklaces.sub_categories.find_or_create_by(value: 'Pendants', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

bracelets = jewelry.categories.find_or_create_by(value: 'Bracelets', code: generate_category_code(category_code))
category_code += 1
bracelets.sub_categories.find_or_create_by(value: 'Cuffs', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
bracelets.sub_categories.find_or_create_by(value: 'Charm Bracelets', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Toys
toy_cars = toys.categories.find_or_create_by(value: 'Toy Cars', code: generate_category_code(category_code))
category_code += 1
toy_cars.sub_categories.find_or_create_by(value: 'Die-Cast Cars', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
toy_cars.sub_categories.find_or_create_by(value: 'Plastic Cars', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

rc_cars = toys.categories.find_or_create_by(value: 'RC Cars', code: generate_category_code(category_code))
category_code += 1
rc_cars.sub_categories.find_or_create_by(value: 'Electric RC Cars', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
rc_cars.sub_categories.find_or_create_by(value: 'Gas RC Cars', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

board_games = toys.categories.find_or_create_by(value: 'Board Games', code: generate_category_code(category_code))
category_code += 1
board_games.sub_categories.find_or_create_by(value: 'Strategy Games', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
board_games.sub_categories.find_or_create_by(value: 'Family Games', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Books
note_books = books.categories.find_or_create_by(value: 'Note Books', code: generate_category_code(category_code))
category_code += 1
note_books.sub_categories.find_or_create_by(value: 'Lined Notebooks', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
note_books.sub_categories.find_or_create_by(value: 'Blank Notebooks', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

magazines = books.categories.find_or_create_by(value: 'Magazines', code: generate_category_code(category_code))
category_code += 1
magazines.sub_categories.find_or_create_by(value: 'Fashion Magazines', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
magazines.sub_categories.find_or_create_by(value: 'Tech Magazines', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

writing_supplies = books.categories.find_or_create_by(value: 'Writting Supplies', code: generate_category_code(category_code))
category_code += 1
writing_supplies.sub_categories.find_or_create_by(value: 'Pens', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
writing_supplies.sub_categories.find_or_create_by(value: 'Pencils', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

# Appliances
blenders = appliances.categories.find_or_create_by(value: 'Blenders', code: generate_category_code(category_code))
category_code += 1
blenders.sub_categories.find_or_create_by(value: 'Hand Blenders', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
blenders.sub_categories.find_or_create_by(value: 'Countertop Blenders', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

coffee_makers = appliances.categories.find_or_create_by(value: 'Coffee Makers', code: generate_category_code(category_code))
category_code += 1
coffee_makers.sub_categories.find_or_create_by(value: 'Drip Coffee Makers', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1
coffee_makers.sub_categories.find_or_create_by(value: 'Espresso Machines', code: generate_subcategory_code(subcategory_code))
subcategory_code += 1

#shop locations
thalawathugoda = ShopLocation.find_or_create_by(name: 'Thalawathugoda', code: "001")
kottawa = ShopLocation.find_or_create_by(name: 'Kottawa', code: "002")
nuwara = ShopLocation.find_or_create_by(name: 'Nuwara', code: "003")

# #sell type
digital = ListingType.find_or_create_by(name: 'Digital', code: "1")
store = ListingType.find_or_create_by(name: 'Store', code: "2")
online = ListingType.find_or_create_by(name: 'online ', code: "3")
