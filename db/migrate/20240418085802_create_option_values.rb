class CreateOptionValues < ActiveRecord::Migration[7.0]
  def change
    create_table :option_values do |t|
      t.string :name,null: false,array: true, default: []
      t.references :option_type, null: false, foreign_key: true
      t.integer :position 
      t.timestamps
    end
  end
end
