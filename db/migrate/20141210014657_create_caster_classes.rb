class CreateCasterClasses < ActiveRecord::Migration
  def change
    create_table :caster_classes do |t|
      t.string :name

      t.timestamps
    end

    create_join_table :caster_classes, :spells
  end
end
