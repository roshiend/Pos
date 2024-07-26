class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name
      t.string :description
      t.decimal :master_price, precision: 10, scale: 2
      t.references :vendor, null: false, foreign_key: true
      t.references :product_type, null: false, foreign_key: true
      t.references :shop_location, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.references :listing_type, null: false, foreign_key: true
      t.timestamps
    end
  end
end

