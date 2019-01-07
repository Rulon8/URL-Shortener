class Url < ApplicationRecord
  validates :title, :original_url, :visit_count, presence: true
  validates :short_url, :original_url, uniqueness: true
  validates :short_url, format: { with: /[a-zA-Z0-9]/, allow_nil: true, message: "invalid short url" }
  validates :original_url, format: { with: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/, message: "invalid original url" }
  validates :visit_count, numericality: { only_integer: true, greater_than_or_equal_to: 0, message: "count must be greater than 0" }

  # Formats a Url object as JSON, removing unnecessary attributes such
  # as id and created_at.
  #
  # Examples
  #
  #   render json: my_url_object
  #   # => {"title":"Google","short_url":"b","original_url":"https://www.google.com/","visit_count":0}
  #
  # Returns a JSON object with the selected values.
  def as_json(options={})
    super(only: [:title,:short_url,:original_url,:visit_count])
  end
end
