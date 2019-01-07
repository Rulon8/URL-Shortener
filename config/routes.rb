Rails.application.routes.draw do
  get 'url', to: 'urls#new', constraints: lambda { |req| req.format == :json }
  post 'url', to: 'urls#new', constraints: lambda { |req| req.format == :json }
  get 'top', to: 'urls#top', constraints: lambda { |req| req.format == :json }
  get ':short_url', to: 'urls#show', short_url: /[a-zA-z0-9]+/
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
