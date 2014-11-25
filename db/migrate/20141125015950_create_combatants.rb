class CreateCombatants < ActiveRecord::Migration
  def change
    create_table :combatants do |t|
      t.string :name
      t.integer :count
      t.integer :effect
      t.boolean :active

      t.timestamps
    end
  end
end
