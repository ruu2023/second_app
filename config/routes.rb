Rails.application.routes.draw do
  devise_for :users
  resources :posts do
    collection do
      get 'ongoing_index'
    end
  end
  root 'posts#index'
end
