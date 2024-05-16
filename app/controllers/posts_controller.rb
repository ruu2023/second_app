class PostsController < ApplicationController
  def index
    @posts = Post.all.order(created_at: :desc)
  end

  def create
    post = Post.create(content: params[:content])
    render json:{ post: post }
  end
end
