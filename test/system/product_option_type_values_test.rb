require "application_system_test_case"

class ProductOptionTypeValuesTest < ApplicationSystemTestCase
  setup do
    @product_option_type_value = product_option_type_values(:one)
  end

  test "visiting the index" do
    visit product_option_type_values_url
    assert_selector "h1", text: "Product option type values"
  end

  test "should create product option type value" do
    visit product_option_type_values_url
    click_on "New product option type value"

    click_on "Create Product option type value"

    assert_text "Product option type value was successfully created"
    click_on "Back"
  end

  test "should update Product option type value" do
    visit product_option_type_value_url(@product_option_type_value)
    click_on "Edit this product option type value", match: :first

    click_on "Update Product option type value"

    assert_text "Product option type value was successfully updated"
    click_on "Back"
  end

  test "should destroy Product option type value" do
    visit product_option_type_value_url(@product_option_type_value)
    click_on "Destroy this product option type value", match: :first

    assert_text "Product option type value was successfully destroyed"
  end
end
