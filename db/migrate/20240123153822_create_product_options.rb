class CreateProductOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :product_options do |t|
      t.string :product_option_name,null: false
      t.string :product_option_values,null: false,array: true, default: []
      t.references :product, null: false, foreign_key: true

      t.timestamps
    end
  end
end


