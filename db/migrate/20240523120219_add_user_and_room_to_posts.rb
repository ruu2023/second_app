class AddUserAndRoomToPosts < ActiveRecord::Migration[7.0]
  def change
    remove_column :posts, :user_id, :integer
    remove_column :posts, :room_id, :integer
  end
end
