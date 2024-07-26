class CreateVendors < ActiveRecord::Migration[7.0]
  def change
    create_table :vendors do |t|
      t.string :name
      t.string :code
      #t.references :shop_location, null: false, foreign_key: true
      t.timestamps
    end
  end
end
