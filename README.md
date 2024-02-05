t.references :product, null: false, foreign_key: true
      t.references :combination, null: false, foreign_key: true
      t.string :sku
      t.decimal :price, precision: 10, scale: 2

      t.timestamps
    end