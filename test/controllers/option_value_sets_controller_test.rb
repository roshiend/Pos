require "test_helper"

class OptionValueSetsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @option_value_set = option_value_sets(:one)
  end

  test "should get index" do
    get option_value_sets_url
    assert_response :success
  end

  test "should get new" do
    get new_option_value_set_url
    assert_response :success
  end

  test "should create option_value_set" do
    assert_difference("OptionValueSet.count") do
      post option_value_sets_url, params: { option_value_set: {  } }
    end

    assert_redirected_to option_value_set_url(OptionValueSet.last)
  end

  test "should show option_value_set" do
    get option_value_set_url(@option_value_set)
    assert_response :success
  end

  test "should get edit" do
    get edit_option_value_set_url(@option_value_set)
    assert_response :success
  end

  test "should update option_value_set" do
    patch option_value_set_url(@option_value_set), params: { option_value_set: {  } }
    assert_redirected_to option_value_set_url(@option_value_set)
  end

  test "should destroy option_value_set" do
    assert_difference("OptionValueSet.count", -1) do
      delete option_value_set_url(@option_value_set)
    end

    assert_redirected_to option_value_sets_url
  end
end
