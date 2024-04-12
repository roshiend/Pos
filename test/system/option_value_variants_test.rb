require "application_system_test_case"

class OptionValueVariantsTest < ApplicationSystemTestCase
  setup do
    @option_value_variant = option_value_variants(:one)
  end

  test "visiting the index" do
    visit option_value_variants_url
    assert_selector "h1", text: "Option value variants"
  end

  test "should create option value variant" do
    visit option_value_variants_url
    click_on "New option value variant"

    click_on "Create Option value variant"

    assert_text "Option value variant was successfully created"
    click_on "Back"
  end

  test "should update Option value variant" do
    visit option_value_variant_url(@option_value_variant)
    click_on "Edit this option value variant", match: :first

    click_on "Update Option value variant"

    assert_text "Option value variant was successfully updated"
    click_on "Back"
  end

  test "should destroy Option value variant" do
    visit option_value_variant_url(@option_value_variant)
    click_on "Destroy this option value variant", match: :first

    assert_text "Option value variant was successfully destroyed"
  end
end
