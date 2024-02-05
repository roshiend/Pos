require "application_system_test_case"

class CombinationsTest < ApplicationSystemTestCase
  setup do
    @combination = combinations(:one)
  end

  test "visiting the index" do
    visit combinations_url
    assert_selector "h1", text: "Combinations"
  end

  test "should create combination" do
    visit combinations_url
    click_on "New combination"

    fill_in "Option combination", with: @combination.option_combination
    click_on "Create Combination"

    assert_text "Combination was successfully created"
    click_on "Back"
  end

  test "should update Combination" do
    visit combination_url(@combination)
    click_on "Edit this combination", match: :first

    fill_in "Option combination", with: @combination.option_combination
    click_on "Update Combination"

    assert_text "Combination was successfully updated"
    click_on "Back"
  end

  test "should destroy Combination" do
    visit combination_url(@combination)
    click_on "Destroy this combination", match: :first

    assert_text "Combination was successfully destroyed"
  end
end
