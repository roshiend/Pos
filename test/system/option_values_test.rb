require "application_system_test_case"

class OptionValuesTest < ApplicationSystemTestCase
  setup do
    @option_value = option_values(:one)
  end

  test "visiting the index" do
    visit option_values_url
    assert_selector "h1", text: "Option values"
  end

  test "should create option value" do
    visit option_values_url
    click_on "New option value"

    fill_in "Value", with: @option_value.value
    click_on "Create Option value"

    assert_text "Option value was successfully created"
    click_on "Back"
  end

  test "should update Option value" do
    visit option_value_url(@option_value)
    click_on "Edit this option value", match: :first

    fill_in "Value", with: @option_value.value
    click_on "Update Option value"

    assert_text "Option value was successfully updated"
    click_on "Back"
  end

  test "should destroy Option value" do
    visit option_value_url(@option_value)
    click_on "Destroy this option value", match: :first

    assert_text "Option value was successfully destroyed"
  end
end
