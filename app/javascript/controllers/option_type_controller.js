// app/javascript/controllers/option_type_controller.js
import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["container"]

  addOptionType(event) {
    event.preventDefault()

    Rails.ajax({
      url: '/option_types/new',
      type: 'GET',
      dataType: 'html',
      success: (data) => {
        this.containerTarget.insertAdjacentHTML('beforeend', data)
      }
    })
  }
}
