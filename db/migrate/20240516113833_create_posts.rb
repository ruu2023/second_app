class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.text :posted_at
      t.text :title
      t.text :pic
      t.text :status
      t.text :content
      t.timestamps
    end
  end
end
