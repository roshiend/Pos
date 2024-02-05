class CreateCombinations < ActiveRecord::Migration[7.0]
  def change
    create_table :combinations do |t|
      t.string :option_combination
      t.references :product, null: false, foreign_key: true
      t.references :variant, null: false, foreign_key: true
      t.timestamps
    end
  end
end
