class CombatantsEffectString < ActiveRecord::Migration[6.1]
  def up
    remove_column :combatants, :effect
    add_column :combatants, :notes, :string
  end

  def down
    remove_column :combatants, :notes
    add_column :combatants, :effect, :integer
  end
end
