require "application_system_test_case"

class OptionTypesTest < ApplicationSystemTestCase
  setup do
    @option_type = option_types(:one)
  end

  test "visiting the index" do
    visit option_types_url
    assert_selector "h1", text: "Option types"
  end

  test "should create option type" do
    visit option_types_url
    click_on "New option type"

    click_on "Create Option type"

    assert_text "Option type was successfully created"
    click_on "Back"
  end

  test "should update Option type" do
    visit option_type_url(@option_type)
    click_on "Edit this option type", match: :first

    click_on "Update Option type"

    assert_text "Option type was successfully updated"
    click_on "Back"
  end

  test "should destroy Option type" do
    visit option_type_url(@option_type)
    click_on "Destroy this option type", match: :first

    assert_text "Option type was successfully destroyed"
  end
end
