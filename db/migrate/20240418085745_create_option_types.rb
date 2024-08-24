class CreateOptionTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :option_types do |t|
      t.string :name
      t.string :value,null: false,array: true, default: []
      t.integer :position 
      t.references :product, foreign_key: true,null: false
      t.timestamps
    end
  end
end

