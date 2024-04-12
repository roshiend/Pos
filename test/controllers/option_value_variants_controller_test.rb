require "test_helper"

class OptionValueVariantsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @option_value_variant = option_value_variants(:one)
  end

  test "should get index" do
    get option_value_variants_url
    assert_response :success
  end

  test "should get new" do
    get new_option_value_variant_url
    assert_response :success
  end

  test "should create option_value_variant" do
    assert_difference("OptionValueVariant.count") do
      post option_value_variants_url, params: { option_value_variant: {  } }
    end

    assert_redirected_to option_value_variant_url(OptionValueVariant.last)
  end

  test "should show option_value_variant" do
    get option_value_variant_url(@option_value_variant)
    assert_response :success
  end

  test "should get edit" do
    get edit_option_value_variant_url(@option_value_variant)
    assert_response :success
  end

  test "should update option_value_variant" do
    patch option_value_variant_url(@option_value_variant), params: { option_value_variant: {  } }
    assert_redirected_to option_value_variant_url(@option_value_variant)
  end

  test "should destroy option_value_variant" do
    assert_difference("OptionValueVariant.count", -1) do
      delete option_value_variant_url(@option_value_variant)
    end

    assert_redirected_to option_value_variants_url
  end
end
