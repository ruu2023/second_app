class AppMigration < ActiveRecord::Migration[7.0]
  def change

    create_table :posts, force: :cascade do |t|
      t.text :posted_at
      t.text :title
      t.text :pic
      t.text :status
      t.text :content
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.bigint :room_id, null: false
      t.bigint :user_id, null: false
      t.index :room_id, name: "index_posts_on_room_id"
      t.index :user_id, name: "index_posts_on_user_id"
    end

    create_table :room_users, force: :cascade do |t|
      t.bigint :room_id, null: false
      t.bigint :user_id, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index :room_id, name: "index_room_users_on_room_id"
      t.index :user_id, name: "index_room_users_on_user_id"
    end

    create_table :rooms, force: :cascade do |t|
      t.string :name, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end

    create_table :users, force: :cascade do |t|
      t.string :email, default: "", null: false
      t.string :nickname, default: "", null: false
      t.string :encrypted_password, default: "", null: false
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index :email, name: "index_users_on_email", unique: true
      t.index :reset_password_token, name: "index_users_on_reset_password_token", unique: true
    end

    add_foreign_key :posts, :rooms
    add_foreign_key :posts, :users
    add_foreign_key :room_users, :rooms
    add_foreign_key :room_users, :users


  end
end
