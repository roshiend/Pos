class CreateVariants < ActiveRecord::Migration[7.0]
  def change
    create_table :variants do |t|
      t.string :sku
      t.string :option1
      t.string :option2
      t.string :option3
      t.decimal :price, precision: 10, scale: 2
      t.string :title
      t.string  :unique_id
      t.string :barcode
      t.integer :position 
      t.references :product, null: false, foreign_key: true
      t.references :shop_location, null: false, foreign_key: true
      t.timestamps
    end
  end
end
