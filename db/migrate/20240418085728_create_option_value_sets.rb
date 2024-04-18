class CreateOptionValueSets < ActiveRecord::Migration[7.0]
  def change
    create_table :option_value_sets do |t|
      t.string :value
      t.references :option_type_set, null: false, foreign_key: true
      t.timestamps
    end
  end
end
