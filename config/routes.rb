Rails.application.routes.draw do
  get 'url', to: 'urls#new', constraints: lambda { |req| req.format == :json }
  post 'url', to: 'urls#new', constraints: lambda { |req| req.format == :json }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
