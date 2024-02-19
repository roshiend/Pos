require "test_helper"

class OptionValuesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @option_value = option_values(:one)
  end

  test "should get index" do
    get option_values_url
    assert_response :success
  end

  test "should get new" do
    get new_option_value_url
    assert_response :success
  end

  test "should create option_value" do
    assert_difference("OptionValue.count") do
      post option_values_url, params: { option_value: { value: @option_value.value } }
    end

    assert_redirected_to option_value_url(OptionValue.last)
  end

  test "should show option_value" do
    get option_value_url(@option_value)
    assert_response :success
  end

  test "should get edit" do
    get edit_option_value_url(@option_value)
    assert_response :success
  end

  test "should update option_value" do
    patch option_value_url(@option_value), params: { option_value: { value: @option_value.value } }
    assert_redirected_to option_value_url(@option_value)
  end

  test "should destroy option_value" do
    assert_difference("OptionValue.count", -1) do
      delete option_value_url(@option_value)
    end

    assert_redirected_to option_values_url
  end
end
