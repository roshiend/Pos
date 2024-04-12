class CreateProductOptionTypeValues < ActiveRecord::Migration[7.0]
  def change
    create_table :product_option_type_values do |t|
      t.references :product, null: false, foreign_key: true
      #t.references :option_type, null: false, foreign_key: true
      t.integer :product_option_name,null: false
      t.integer :product_option_values,null: false,array: true, default: []
      t.timestamps
    end
  end
end
