require "test_helper"

class OptionTypesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @option_type = option_types(:one)
  end

  test "should get index" do
    get option_types_url
    assert_response :success
  end

  test "should get new" do
    get new_option_type_url
    assert_response :success
  end

  test "should create option_type" do
    assert_difference("OptionType.count") do
      post option_types_url, params: { option_type: {  } }
    end

    assert_redirected_to option_type_url(OptionType.last)
  end

  test "should show option_type" do
    get option_type_url(@option_type)
    assert_response :success
  end

  test "should get edit" do
    get edit_option_type_url(@option_type)
    assert_response :success
  end

  test "should update option_type" do
    patch option_type_url(@option_type), params: { option_type: {  } }
    assert_redirected_to option_type_url(@option_type)
  end

  test "should destroy option_type" do
    assert_difference("OptionType.count", -1) do
      delete option_type_url(@option_type)
    end

    assert_redirected_to option_types_url
  end
end
