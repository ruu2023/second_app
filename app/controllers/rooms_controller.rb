class RoomsController < ApplicationController
  before_action :set_room, only: [:destroy]
  before_action :authenticate_user!

  def index
    @rooms = Room.all
  end

  def new
    @room = Room.new
  end

  def create
    @room = Room.new(room_params)
    if @room.save
      redirect_to room_posts_path(@room)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    @room.destroy
    head :no_content
  end

  private
  def room_params
    params.require(:room).permit(:name, user_ids: [])
  end

  def set_room
    @room = Room.find(params[:id])
  end
end
