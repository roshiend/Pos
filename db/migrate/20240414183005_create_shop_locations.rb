class CreateShopLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :shop_locations do |t|
      t.string :name
      t.string :code

      t.timestamps
    end
  end
end
