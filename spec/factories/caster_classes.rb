FactoryBot.define do
  factory :caster_class do
    trait :random_nym do
      nym do
        ('A'..'Z').to_a.sample + ('a'..'z').to_a.sample(9).join
      end
    end
  end
end
