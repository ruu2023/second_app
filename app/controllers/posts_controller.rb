class PostsController < ApplicationController
  before_action :set_post, only: [:destroy]

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
    @posts = Post.where(status: '進行中').order(created_at: :desc)
  end

  private
  def post_params
    params.require(:post).permit(:title, :pic, :status, :content)
  end

  def set_post
    @post = Post.find(params[:id])
  end
end
