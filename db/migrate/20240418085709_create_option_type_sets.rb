class CreateOptionTypeSets < ActiveRecord::Migration[7.0]
  def change
    create_table :option_type_sets do |t|
      t.string :name
      t.timestamps
    end
  end
end
