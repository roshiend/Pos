import { Application } from "@hotwired/stimulus"

// removed this nested from here so i can override the nestedform add remove options
//import NestedForm from 'stimulus-rails-nested-form'

const application = Application.start()

//application.register('product-options', NestedForm)
// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
