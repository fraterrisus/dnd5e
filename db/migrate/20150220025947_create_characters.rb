class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name
      t.boolean :highlight
      t.integer :str
      t.integer :dex
      t.integer :con
      t.integer :int
      t.integer :wis
      t.integer :chr
      t.integer :perception
      t.integer :ac
      t.integer :initiative
      t.integer :speed
      t.text :notes

      t.timestamps
    end
  end
end
