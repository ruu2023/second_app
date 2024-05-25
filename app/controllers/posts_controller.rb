class PostsController < ApplicationController
  before_action :set_post, only: [:destroy]
  before_action :authenticate_user!

  def index
    # @posts = Post.where(params[:room_id]).order(created_at: :desc)
    @rooms = Room.all
    @post = Post.new
    @room = Room.find(params[:room_id])
    @posts = @room.posts.includes(:user)
  end
  
  def create
    @posts = Post.all.order(created_at: :desc)
    @rooms = Room.all
    @room = Room.find(params[:room_id])
    # @post = @room.posts.build(post_params)
    post = @room.posts.create(post_params)
    # if @post.save
    #   redirect_to room_posts_path(@room)
    # else
    #   render :index, status: :unprocessable_entity
    # end
    # post = Post.create(post_params)
    render json:{ post: post }
  end

  def destroy
    @post.destroy
    head :no_content
  end

  def ongoing_index
    @posts = Post.where(status: '継続').order(created_at: :desc)
    respond_to do |format|
      format.html
      format.json { render json: @posts.map { |post| { id: post.id, posted_at: post.posted_at, title: post.title, pic: post.pic, status: post.status, content: post.content, created_at: post.created_at, updated_at: post.updated_at } } }
    end
  end

  private
  def post_params
    params.require(:post).permit(:title, :pic, :status, :content).merge(user_id: current_user.id)
  end

  def set_post
    @post = Post.find(params[:id])
  end
end
