require "application_system_test_case"

class OptionValueSetsTest < ApplicationSystemTestCase
  setup do
    @option_value_set = option_value_sets(:one)
  end

  test "visiting the index" do
    visit option_value_sets_url
    assert_selector "h1", text: "Option value sets"
  end

  test "should create option value set" do
    visit option_value_sets_url
    click_on "New option value set"

    click_on "Create Option value set"

    assert_text "Option value set was successfully created"
    click_on "Back"
  end

  test "should update Option value set" do
    visit option_value_set_url(@option_value_set)
    click_on "Edit this option value set", match: :first

    click_on "Update Option value set"

    assert_text "Option value set was successfully updated"
    click_on "Back"
  end

  test "should destroy Option value set" do
    visit option_value_set_url(@option_value_set)
    click_on "Destroy this option value set", match: :first

    assert_text "Option value set was successfully destroyed"
  end
end
