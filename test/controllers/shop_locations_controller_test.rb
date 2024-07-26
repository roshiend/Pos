require "test_helper"

class ShopLocationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @shop_location = shop_locations(:one)
  end

  test "should get index" do
    get shop_locations_url
    assert_response :success
  end

  test "should get new" do
    get new_shop_location_url
    assert_response :success
  end

  test "should create shop_location" do
    assert_difference("ShopLocation.count") do
      post shop_locations_url, params: { shop_location: { code: @shop_location.code, name: @shop_location.name } }
    end

    assert_redirected_to shop_location_url(ShopLocation.last)
  end

  test "should show shop_location" do
    get shop_location_url(@shop_location)
    assert_response :success
  end

  test "should get edit" do
    get edit_shop_location_url(@shop_location)
    assert_response :success
  end

  test "should update shop_location" do
    patch shop_location_url(@shop_location), params: { shop_location: { code: @shop_location.code, name: @shop_location.name } }
    assert_redirected_to shop_location_url(@shop_location)
  end

  test "should destroy shop_location" do
    assert_difference("ShopLocation.count", -1) do
      delete shop_location_url(@shop_location)
    end

    assert_redirected_to shop_locations_url
  end
end
