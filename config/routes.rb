Rails.application.routes.draw do
  devise_for :users
  root to: "rooms#index"
  resources :rooms do
    resources :posts do
      collection do
        get 'ongoing_index'
      end
    end
  end
end
