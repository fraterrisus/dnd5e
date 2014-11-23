class ActiveRecord::Base
  def value_to_boolean(x)
    ActiveRecord::ConnectionAdapters::Column.value_to_boolean(x)
  end
end
