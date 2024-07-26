require "test_helper"

class ListingTypesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @listing_type = listing_types(:one)
  end

  test "should get index" do
    get listing_types_url
    assert_response :success
  end

  test "should get new" do
    get new_listing_type_url
    assert_response :success
  end

  test "should create listing_type" do
    assert_difference("ListingType.count") do
      post listing_types_url, params: { listing_type: { code: @listing_type.code, name: @listing_type.name } }
    end

    assert_redirected_to listing_type_url(ListingType.last)
  end

  test "should show listing_type" do
    get listing_type_url(@listing_type)
    assert_response :success
  end

  test "should get edit" do
    get edit_listing_type_url(@listing_type)
    assert_response :success
  end

  test "should update listing_type" do
    patch listing_type_url(@listing_type), params: { listing_type: { code: @listing_type.code, name: @listing_type.name } }
    assert_redirected_to listing_type_url(@listing_type)
  end

  test "should destroy listing_type" do
    assert_difference("ListingType.count", -1) do
      delete listing_type_url(@listing_type)
    end

    assert_redirected_to listing_types_url
  end
end
