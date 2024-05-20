Rails.application.routes.draw do
  resources :posts do
    collection do
      get 'ongoing_index'
    end
  end
end
