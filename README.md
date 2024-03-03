<% if combinations.present? %>
  <h2>Variants</h2>
  <ul>
    <% combinations.each_with_index do |combination, index| %>
      <li>
        <%= combination %>

        <%= form.fields_for :variants, Variant.new, child_index: index do |v|  %>
          <%= v.hidden_field :combinations_attributes, index: index, value: { option_combination: combination } %> 
          <%= v.text_field :sku, placeholder: 'SKU' %>
          <%= v.text_field :price, placeholder: 'Price' %>
        <% end %>
      </li>
    <% end %>

  </ul>
<% else %>
  <p>No variants available</p>
<% end %>