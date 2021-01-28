class RenameNameFields < ActiveRecord::Migration[6.1]
  MODELS = [CasterClass, Character, Combatant, Spell]

  def change
    MODELS.each do |klass|
      rename_column klass, :name, :nym
    end
  end
end
