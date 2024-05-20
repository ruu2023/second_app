class PostsController < ApplicationController
  before_action :set_post, only: [:destroy]
  before_action :authenticate_user!

  def index
    @posts = Post.all.order(created_at: :desc)
  end

  def create
    post = Post.create(post_params)
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
    params.require(:post).permit(:title, :pic, :status, :content)
  end

  def set_post
    @post = Post.find(params[:id])
  end
end
