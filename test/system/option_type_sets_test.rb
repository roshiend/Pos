require "application_system_test_case"

class OptionTypeSetsTest < ApplicationSystemTestCase
  setup do
    @option_type_set = option_type_sets(:one)
  end

  test "visiting the index" do
    visit option_type_sets_url
    assert_selector "h1", text: "Option type sets"
  end

  test "should create option type set" do
    visit option_type_sets_url
    click_on "New option type set"

    click_on "Create Option type set"

    assert_text "Option type set was successfully created"
    click_on "Back"
  end

  test "should update Option type set" do
    visit option_type_set_url(@option_type_set)
    click_on "Edit this option type set", match: :first

    click_on "Update Option type set"

    assert_text "Option type set was successfully updated"
    click_on "Back"
  end

  test "should destroy Option type set" do
    visit option_type_set_url(@option_type_set)
    click_on "Destroy this option type set", match: :first

    assert_text "Option type set was successfully destroyed"
  end
end
