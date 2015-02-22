class TrimSpells < ActiveRecord::Migration
  def up
    remove_column :spells, :page
    remove_column :spells, :aoe
    remove_column :spells, :effect
    remove_column :spells, :higher
    remove_column :spells, :reaction
  end

  def down
    add_column :spells, :page, :integer
    add_column :spells, :aoe, :string
    add_column :spells, :effect, :string
    add_column :spells, :higher, :string
    add_column :spells, :reaction, :string
  end
end
