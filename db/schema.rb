# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_01_28_231556) do

  create_table "caster_classes", force: :cascade do |t|
    t.string "nym", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "caster_classes_spells", id: false, force: :cascade do |t|
    t.integer "caster_class_id", null: false
    t.integer "spell_id", null: false
  end

  create_table "characters", force: :cascade do |t|
    t.string "nym", limit: 255
    t.boolean "highlight"
    t.integer "str"
    t.integer "dex"
    t.integer "con"
    t.integer "int"
    t.integer "wis"
    t.integer "chr"
    t.integer "perception"
    t.integer "ac"
    t.integer "initiative"
    t.integer "speed"
    t.text "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "combatants", force: :cascade do |t|
    t.string "nym", limit: 255
    t.integer "time"
    t.boolean "active"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "notes"
  end

  create_table "spells", force: :cascade do |t|
    t.string "nym", limit: 255
    t.integer "level"
    t.integer "school_id"
    t.boolean "ritual"
    t.integer "cast_n"
    t.integer "cast_unit"
    t.integer "range_n"
    t.integer "range_unit"
    t.integer "components"
    t.boolean "concentration"
    t.integer "duration_n"
    t.integer "duration_unit"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
