require "application_system_test_case"

class ListingTypesTest < ApplicationSystemTestCase
  setup do
    @listing_type = listing_types(:one)
  end

  test "visiting the index" do
    visit listing_types_url
    assert_selector "h1", text: "Listing types"
  end

  test "should create listing type" do
    visit listing_types_url
    click_on "New listing type"

    fill_in "Code", with: @listing_type.code
    fill_in "Name", with: @listing_type.name
    click_on "Create Listing type"

    assert_text "Listing type was successfully created"
    click_on "Back"
  end

  test "should update Listing type" do
    visit listing_type_url(@listing_type)
    click_on "Edit this listing type", match: :first

    fill_in "Code", with: @listing_type.code
    fill_in "Name", with: @listing_type.name
    click_on "Update Listing type"

    assert_text "Listing type was successfully updated"
    click_on "Back"
  end

  test "should destroy Listing type" do
    visit listing_type_url(@listing_type)
    click_on "Destroy this listing type", match: :first

    assert_text "Listing type was successfully destroyed"
  end
end
