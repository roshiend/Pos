require "test_helper"

class ProductOptionTypeValuesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @product_option_type_value = product_option_type_values(:one)
  end

  test "should get index" do
    get product_option_type_values_url
    assert_response :success
  end

  test "should get new" do
    get new_product_option_type_value_url
    assert_response :success
  end

  test "should create product_option_type_value" do
    assert_difference("ProductOptionTypeValue.count") do
      post product_option_type_values_url, params: { product_option_type_value: {  } }
    end

    assert_redirected_to product_option_type_value_url(ProductOptionTypeValue.last)
  end

  test "should show product_option_type_value" do
    get product_option_type_value_url(@product_option_type_value)
    assert_response :success
  end

  test "should get edit" do
    get edit_product_option_type_value_url(@product_option_type_value)
    assert_response :success
  end

  test "should update product_option_type_value" do
    patch product_option_type_value_url(@product_option_type_value), params: { product_option_type_value: {  } }
    assert_redirected_to product_option_type_value_url(@product_option_type_value)
  end

  test "should destroy product_option_type_value" do
    assert_difference("ProductOptionTypeValue.count", -1) do
      delete product_option_type_value_url(@product_option_type_value)
    end

    assert_redirected_to product_option_type_values_url
  end
end
