require "application_system_test_case"

class ShopLocationsTest < ApplicationSystemTestCase
  setup do
    @shop_location = shop_locations(:one)
  end

  test "visiting the index" do
    visit shop_locations_url
    assert_selector "h1", text: "Shop locations"
  end

  test "should create shop location" do
    visit shop_locations_url
    click_on "New shop location"

    fill_in "Code", with: @shop_location.code
    fill_in "Name", with: @shop_location.name
    click_on "Create Shop location"

    assert_text "Shop location was successfully created"
    click_on "Back"
  end

  test "should update Shop location" do
    visit shop_location_url(@shop_location)
    click_on "Edit this shop location", match: :first

    fill_in "Code", with: @shop_location.code
    fill_in "Name", with: @shop_location.name
    click_on "Update Shop location"

    assert_text "Shop location was successfully updated"
    click_on "Back"
  end

  test "should destroy Shop location" do
    visit shop_location_url(@shop_location)
    click_on "Destroy this shop location", match: :first

    assert_text "Shop location was successfully destroyed"
  end
end
