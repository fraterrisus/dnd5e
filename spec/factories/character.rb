FactoryBot.define do
  factory :character do
    str { Random.rand(3..18) }
    dex { Random.rand(3..18) }
    con { Random.rand(3..18) }
    int { Random.rand(3..18) }
    wis { Random.rand(3..18) }
    chr { Random.rand(3..18) }
    perception { Random.rand(8..12) }
    ac { Random.rand(10..20) }
    initiative { Random.rand(0..5) }
    speed { 30 }
    highlight { false }

    nym do
      "#{('a'..'z').to_a.sample(10).join.capitalize} #{('a'..'z').to_a.sample(10).join.capitalize}"
    end

    trait :highlighted do
      highlight { true }
    end

    trait :with_notes do
      notes do
        ('a'..'z').to_a.sample(10).join.capitalize
      end
    end
  end
end
