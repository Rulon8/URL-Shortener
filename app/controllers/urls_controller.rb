require 'socket'

class UrlsController < ApplicationController
  # Base62 alphabet containing the valid characters for a short URL
  ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  # Checks if received URL is already shortened and stored in the
  # database. If URL is not in the database calls method to shorten it.
  #
  # url - The URL to be searched for or shortened.
  #
  # Examples
  #
  #   if successful
  #   # => {"short_url": "localhost/eDj3k"}
  #
  #   if unsuccessful
  #   # => {"status":500,"errors":{"original_url":["invalid original url"]}}
  #
  # Returns a JSON object with either the stored or the new shortened
  # version of the URL with the following syntax: {short_url: your_url}.
  # Alternatively, returns a JSON object with errors.
  def new
    orig_url = params[:url]
    # Check if URL is already saved
    stored_entry = Url.where(original_url: orig_url).first
    if stored_entry.nil?
      # Add new URL
      short_url = create(orig_url)
    else
      short_url = { short_url: stored_entry.short_url }
    end
    if short_url.has_key?(:errors)
      # If there are errors show 500 error
      render json: short_url, status: 500
    else
      # Consider ports other than 80, eg. rails default port 3000
      if request.port == 80 || request.port == 443
        short_url[:short_url] = request.host + '/' + short_url[:short_url]
      else
        short_url[:short_url] = request.host + ':' + request.port.to_s + '/' + short_url[:short_url]
      end
      render json: short_url
    end
  end

  # Checks if received short url is already stored in the database and
  # can be used to redirect the user. Also adds one to the visit counter
  # for that url.
  #
  # short_url - The short version of a URL generated previously by the
  # app.
  #
  # Examples
  #
  #   if successful
  #   # => HTTP Redirection
  #
  #   if unsuccessful
  #   # => {"status":404,"error":"Not Found"}
  #
  # Redirects the user to the corresponding original URL using HTTP
  # status 301 if the short_url is stored in the database. Otherwise
  # returns a JSON object with a 404 message.
  def show
    short_url = params[:short_url]
    stored_url = Url.where(short_url: short_url).first
    if stored_url.nil?
      render json: { "status": 404, "error": "Not Found" }, status: 404
    else
      stored_url.add_visit()
      stored_url.save
      redirect_to stored_url.original_url, status: 301
    end
  end

  # Looks for the top 100 most visited URLs, ordered by visit count.
  #
  # Returns a JSON object that includes the title, short URL, original
  # URL and visit count of each of the top most visited URLs. If there
  # are less than 100 URLs stored in the system returns all of them,
  # or an empty JSON if there are none. If the title for a URL has not
  # yet been fetched, or if it doesn't exist (eg. on a 404 error), the
  # title will be shown as "Not Available".
  def top
    top_urls = Url.order(visit_count: :desc).limit(100)
    render json: top_urls
  end

  private

  # Creates a new URL entry in the database. The entry must first be created
  # without its short URL value because this value is generated from its id,
  # and the id is assigned after creation. Then calls encode to get the new
  # short URL value and updates the entry. If the creation is successful
  # starts a new worker process to include its title.
  #
  # orig_url - The original URL that was sent by the user and that will be
  # shortened.
  #
  # Returns a hash with the newly generated short URL associated with orig_url
  # or a hash with errors.
  def create(orig_url)
    new_entry = Url.create(title: 'Not available', original_url: orig_url, visit_count: 0)
    short_url = encode(new_entry.id) unless new_entry.id.nil?
    new_entry.short_url = short_url
    new_entry.save
    if new_entry.errors.messages.length > 0
      return { status: 500, errors: new_entry.errors.messages }
    else
      TitleCrawlerWorker.perform_async(new_entry.id, orig_url)
      return { short_url: short_url }
    end
  end

  # Encodes the given value using BaseX encoding, where X is the base
  # of the encoded value, determined by the alphabet length.
  #
  # id - The value to be encoded.
  #
  # Examples - using Base62
  #
  #   encode(0)
  #   # => 'a'
  #
  #   encode(123)
  #   # => 'b9'
  #
  # Returns the encoded value.
  def encode(id)
    short_url = ''
    base = ALPHABET.length
    while id > 0
      short_url.concat(ALPHABET[id.modulo(base)])
      id = id / base
    end
    return short_url.reverse
  end
end
