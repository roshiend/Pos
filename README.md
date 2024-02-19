<div id="app">
  <%= form_with(model: product, local: true) do |form| %>
    <% if product.errors.any? %>
      <div style="color: red">
        <h2><%= pluralize(product.errors.count, "error") %> prohibited this product from being saved:</h2>

        <ul>
          <% product.errors.each do |error| %>
            <li><%= error.full_message %></li>
          <% end %>
        </ul>
      </div>
    <% end %>

    <div>
      <%= form.label :name, style: "display: block" %>
      <%= form.text_field :name %>
    </div>

    <div>
      <%= form.label :description, style: "display: block" %>
      <%= form.rich_text_area :description %>
    </div>
    <br><br>

    <div class="form-group">
      <label class="col-md-12 col-form-label">Product Options:</label>
      <div class="col-md-12">
        <div v-for="(option, index) in productOptions" :key="index" class="option-row">
          <multiselect v-model="option.product_option_name" :options="filteredOptionNameOptions(option)" track-by="id" label="name" :multiple="false" placeholder="Select Option Name" @input="fetchOptionValues(option)" :allow-empty="false" required></multiselect>
          <%= form.hidden_field :product_option_name_ids, 'v-model': 'option.product_option_name.id' %>
          <multiselect v-model="option.product_option_values" :options="fetchOptionValuesOptions(option.product_option_name.id)" track-by="value" label="value" placeholder="Select Option Values" multiple required></multiselect>
          
          <button type="button" @click="removeOption(index)">Remove Option</button>
        </div>
        <button type="button" @click.prevent="addOption">Add Option</button>
      </div>
    </div>

    <div>
      <%= form.submit %>
    </div>
  <% end %>
</div>
<script>
  // Register the Multiselect component
  Vue.component('multiselect', window.VueMultiselect.default);

  new Vue({
    el: '#app',
    data: {
      optionIndex: 0,
      productOptions: [],
      optionNameOptions: [],
      optionValuesOptions: {},
      selectedProductOptionNames: [],
    },
    methods: {
      addOption() {
        if (this.productOptions.length < 3) {
          this.productOptions.push({ product_option_name: '', product_option_values: '' });
          this.fetchOptions();
          this.optionIndex++;
        }
      },
      removeOption(index) {
        this.optionIndex--;
        const removedOptionId = this.productOptions[index].product_option_name.id;

        const optionIndexToRemove = this.selectedProductOptionNames.indexOf(removedOptionId);
        if (optionIndexToRemove !== -1) {
          this.selectedProductOptionNames.splice(optionIndexToRemove, 1);
        }

        this.productOptions.splice(index, 1);
      },
      fetchOptionValuesOptions(selectedOptionId) {
        return this.optionValuesOptions[selectedOptionId] || [];
      },
      fetchOptions() {
        fetch('/options')
          .then(response => response.json())
          .then(options => {
            this.optionNameOptions = options;
          })
          .catch(error => {
            console.error('Error fetching options:', error);
          });
      },
      fetchOptionValues(option) {
        const selectedOptionId = option.product_option_name.id;
        if (!this.selectedProductOptionNames.includes(selectedOptionId)) {
          this.selectedProductOptionNames.push(selectedOptionId);
        }

        fetch(`/options/${selectedOptionId}/option_values`)
          .then(response => response.json())
          .then(optionValues => {
            this.$set(this.optionValuesOptions, selectedOptionId, optionValues);
            this.$set(option, 'product_option_values', []);
          })
          .catch(error => {
            console.error('Error fetching option values:', error);
          });
      },
    },
    computed: {
      filteredOptionNameOptions() {
        return (option) => {
          const selectedOptionIds = this.selectedProductOptionNames.filter(id => id !== option.product_option_name.id);
          return this.optionNameOptions.filter(opt => !selectedOptionIds.includes(opt.id));
        };
      },
    },
    watch: {
      'productOptions': {
        handler(newVal, oldVal) {
          // Check if the product_option_name field has changed or removed
          newVal.forEach((option, index) => {
            if (oldVal[index].product_option_name.id !== option.product_option_name.id) {
              // Remove the previously selected option from selectedProductOptionNames
              const removedOptionId = oldVal[index].product_option_name.id;
              const optionIndexToRemove = this.selectedProductOptionNames.indexOf(removedOptionId);
              if (optionIndexToRemove !== -1) {
                this.selectedProductOptionNames.splice(optionIndexToRemove, 1);
              }
            }
          });
        },
        deep: true,
      },
      'productOptions.product_option_name': {
        handler(newVal, oldVal) {
          // Check if the product_option_name field has changed
          if (newVal.id !== oldVal.id) {
            // Remove the previously selected option from selectedProductOptionNames
            const removedOptionId = oldVal.id;
            const optionIndexToRemove = this.selectedProductOptionNames.indexOf(removedOptionId);
            if (optionIndexToRemove !== -1) {
              this.selectedProductOptionNames.splice(optionIndexToRemove, 1);
            }
          }
        },
        deep: true,
      },
    },
    mounted() {
      this.fetchOptions();
    },
  });
</script>


