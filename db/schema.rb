# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141125015950) do

  create_table "combatants", force: true do |t|
    t.string   "name"
    t.integer  "count"
    t.integer  "effect"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "spells", force: true do |t|
    t.string   "name"
    t.integer  "page"
    t.integer  "level"
    t.integer  "school_id"
    t.boolean  "ritual"
    t.integer  "cast_n"
    t.integer  "cast_unit"
    t.integer  "range_n"
    t.integer  "range_unit"
    t.string   "aoe"
    t.integer  "components"
    t.boolean  "concentration"
    t.integer  "duration_n"
    t.integer  "duration_unit"
    t.string   "effect"
    t.string   "higher"
    t.string   "reaction"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
