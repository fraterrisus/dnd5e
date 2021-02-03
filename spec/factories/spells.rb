FactoryBot.define do
  factory :spell do
    cast_unit { 0 }
    components { 0 }
    duration_unit { 0 }
    level { 1 }
    range_unit { 0 }
    school_id { 0 }

    trait :random_nym do
      nym do
        ('A'..'Z').to_a.sample + ('a'..'z').to_a.sample(9).join
      end
    end

    trait :random_level do
      level { Random.rand(10) }
    end

    # Spell Level

    trait :cantrip do
      level { 0 }
    end

    # Casting Time

    trait :five_minutes do
      cast_n { 5 }
      cast_unit { 11 }
    end

    trait :reaction do
      cast_n { nil }
      cast_unit { 3 }
    end

    trait :ritual do
      ritual { true }
    end

    # Components

    trait :verbal do
      components { components | 0x8 }
    end

    trait :somatic do
      components { components | 0x4 }
    end

    trait :material do
      components { components | 0x2 }
    end

    trait :focus do
      components { components | 0x1 }
    end

    # Duration

    trait :concentration do
      concentration { true }
    end

    # School

    trait :conjuration do
      school_id { 1 }
    end
  end
end
