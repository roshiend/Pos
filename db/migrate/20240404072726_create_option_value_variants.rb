class CreateOptionValueVariants < ActiveRecord::Migration[7.0]
  def change
    create_table :option_value_variants do |t|
      t.references :variant, null: false, foreign_key: true
      t.references :product_option_type_value, null: false, foreign_key: true
      t.timestamps
    end
  end
end
