require "test_helper"

class SubCatogoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sub_catogory = sub_catogories(:one)
  end

  test "should get index" do
    get sub_catogories_url
    assert_response :success
  end

  test "should get new" do
    get new_sub_catogory_url
    assert_response :success
  end

  test "should create sub_catogory" do
    assert_difference("SubCatogory.count") do
      post sub_catogories_url, params: { sub_catogory: { name: @sub_catogory.name } }
    end

    assert_redirected_to sub_catogory_url(SubCatogory.last)
  end

  test "should show sub_catogory" do
    get sub_catogory_url(@sub_catogory)
    assert_response :success
  end

  test "should get edit" do
    get edit_sub_catogory_url(@sub_catogory)
    assert_response :success
  end

  test "should update sub_catogory" do
    patch sub_catogory_url(@sub_catogory), params: { sub_catogory: { name: @sub_catogory.name } }
    assert_redirected_to sub_catogory_url(@sub_catogory)
  end

  test "should destroy sub_catogory" do
    assert_difference("SubCatogory.count", -1) do
      delete sub_catogory_url(@sub_catogory)
    end

    assert_redirected_to sub_catogories_url
  end
end
