require "test_helper"

class OptionTypeSetsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @option_type_set = option_type_sets(:one)
  end

  test "should get index" do
    get option_type_sets_url
    assert_response :success
  end

  test "should get new" do
    get new_option_type_set_url
    assert_response :success
  end

  test "should create option_type_set" do
    assert_difference("OptionTypeSet.count") do
      post option_type_sets_url, params: { option_type_set: {  } }
    end

    assert_redirected_to option_type_set_url(OptionTypeSet.last)
  end

  test "should show option_type_set" do
    get option_type_set_url(@option_type_set)
    assert_response :success
  end

  test "should get edit" do
    get edit_option_type_set_url(@option_type_set)
    assert_response :success
  end

  test "should update option_type_set" do
    patch option_type_set_url(@option_type_set), params: { option_type_set: {  } }
    assert_redirected_to option_type_set_url(@option_type_set)
  end

  test "should destroy option_type_set" do
    assert_difference("OptionTypeSet.count", -1) do
      delete option_type_set_url(@option_type_set)
    end

    assert_redirected_to option_type_sets_url
  end
end
