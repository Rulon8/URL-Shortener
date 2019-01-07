require 'test_helper'

class UrlsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get urls_new_url
    assert_response :success
  end

end
