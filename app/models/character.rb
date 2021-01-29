class Character < ActiveRecord::Base
  TABLE_FIELDS = %i(str dex con int wis chr perception initiative speed ac).freeze
end
