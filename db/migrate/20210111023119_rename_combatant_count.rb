class RenameCombatantCount < ActiveRecord::Migration[6.1]
  def change
    rename_column Combatant, :count, :time
  end
end
