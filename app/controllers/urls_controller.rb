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
  #   # => {"short_url": "eDj3k"}
  #
  #   if unsuccesful
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
      render json: short_url, status: 500
    else
      render json: short_url
    end
  end

  private

  # Creates a new URL entry in the database. The entry must first be created
  # without its short URL value because this value is generated from its id,
  # and the id is assigned after creation. Then calls encode to get the new
  # short URL value and updates the entry.
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
    puts new_entry.errors.messages
    if new_entry.errors.messages.length > 0
      return { status: 500, errors: new_entry.errors.messages }
    else
      return { short_url: short_url }
    end
  end

  # Encodes the given Base10 value using BaseX encoding, where X is the base
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
