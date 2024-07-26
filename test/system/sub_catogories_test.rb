require "application_system_test_case"

class SubCatogoriesTest < ApplicationSystemTestCase
  setup do
    @sub_catogory = sub_catogories(:one)
  end

  test "visiting the index" do
    visit sub_catogories_url
    assert_selector "h1", text: "Sub catogories"
  end

  test "should create sub catogory" do
    visit sub_catogories_url
    click_on "New sub catogory"

    fill_in "Name", with: @sub_catogory.name
    click_on "Create Sub catogory"

    assert_text "Sub catogory was successfully created"
    click_on "Back"
  end

  test "should update Sub catogory" do
    visit sub_catogory_url(@sub_catogory)
    click_on "Edit this sub catogory", match: :first

    fill_in "Name", with: @sub_catogory.name
    click_on "Update Sub catogory"

    assert_text "Sub catogory was successfully updated"
    click_on "Back"
  end

  test "should destroy Sub catogory" do
    visit sub_catogory_url(@sub_catogory)
    click_on "Destroy this sub catogory", match: :first

    assert_text "Sub catogory was successfully destroyed"
  end
end
