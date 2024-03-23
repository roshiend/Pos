class VariantsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "variants_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
