class UpdateSqliteBooleans < ActiveRecord::Migration[6.1]
  def up
    %i(ritual concentration).each do |field|
      Spell.where("#{field} = 't'").update_all(field => 1)
      Spell.where("#{field} = 'f'").update_all(field => 0)
    end
  end

  def down; end
end
