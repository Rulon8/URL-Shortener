class TitleCrawlerWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  # Crawls the received long_url to look for its title attribute. Then updates
  # the database entry identified by id
  #
  # id - Identifier of the database entry where the webpage title attribute
  # will be stored.
  #
  # long_url - URL of the webpage being stored.
  #
  def perform(id, long_url)
    puts long_url
    response = HTTParty.get(long_url)
    document = Nokogiri::HTML::Document.parse(response.body)
    puts document.title
    url = Url.find(id)
    url.title = document.title
    url.save
  end
end
