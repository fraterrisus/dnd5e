class CreateSpells < ActiveRecord::Migration
  def change
    create_table :spells do |t|
      t.string :name
      t.integer :page
      t.integer :level
      t.integer :school_id
      t.boolean :ritual
      t.integer :cast_n
      t.integer :cast_unit
      t.integer :range_n
      t.integer :range_unit
      t.string :aoe
      t.integer :components
      t.boolean :concentration
      t.integer :duration_n
      t.integer :duration_unit
      t.string :effect
      t.string :higher
      t.string :reaction

      t.timestamps
    end
  end
end
