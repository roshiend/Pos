class CreateVariants < ActiveRecord::Migration[7.0]
  def change
    create_table :variants do |t|
      t.references :product, null: false, foreign_key: true
      t.string :sku
      t.decimal :price, precision: 10, scale: 2
      t.string  :unique_id
      t.timestamps
    end
  end
end
