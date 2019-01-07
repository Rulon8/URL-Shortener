web: bundle exec rails server -p $PORT -e $RACK_ENV
release: rails db:migrate
titlecrawlerworker: bundle exec sidekiq -c 2