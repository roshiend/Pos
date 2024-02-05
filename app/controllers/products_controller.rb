class ProductsController < ApplicationController
  before_action :set_product, only: %i[ show edit update destroy ]

  # GET /products or /products.json
  def index
    @products = Product.all
  end

  # GET /products/1 or /products/1.json
  def show
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
    variants = @product.variants.all
  end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)
  
    if @product.save
      
      respond_to do |format|
        format.html { redirect_to product_url(@product), notice: "Product was successfully created." }
        format.json { render :show, status: :created, location: @product }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end
  
  
  
  # PATCH/PUT /products/1 or /products/1.json
  def update
    # Assuming you have a Product model with variants
    @product = Product.find(params[:id])
    variant_attributes = params[:product][:variant_attributes]
  
    # Iterate through variant_attributes and update the variants
    variant_attributes.each do |index, attributes|
      variant = @product.variants[index.to_i]
      variant.update(attributes.permit(:sku, :price,:unique_id))
      
    end
  
    # Redirect or respond with JSON as needed
    respond_to do |format|
      format.html { redirect_to @product, notice: 'Variants were successfully updated.' }
      format.json { render json: { status: 'success', message: 'Variants were successfully updated.' } }
    end
  end
  
  
 
  def create_variants
    product_options = params[:product_options]
    existing_variants = params[:existing_variants] || [] # Assuming existing_variants is an array of variants
  
    # Ensure product_options is an array and not empty
    return unless product_options.is_a?(Array) && !product_options.empty?
  
    # Generate all possible combinations of product options with SKU and price
    variants = generate_variants(product_options, existing_variants)
  
    # Render the variants as HTML or respond with JSON, depending on your needs
    respond_to do |format|
      format.html { render partial: 'variants', locals: { variants: variants } }
      format.json { render json: { variants: variants } }
    end
  end
  
  

  def destroy
    #@product = Product.find(params[:id])
    @product.destroy

    respond_to do |format|
      format.html { redirect_to products_url, notice: 'Product was successfully destroyed.' }
      format.json { head :no_content }
    end
  
  end
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

     # Only allow a list of trusted parameters through.
     def product_params
      params.require(:product).permit(:name, :description, variants_attributes: [:id, :sku, :price,:unique_id],product_options_attributes:[:id,:_destroy,:product_option_name,product_option_values: []])
    end
    

    def generate_variants(product_options, existing_variants)
      # Example code to generate all possible combinations with SKU and price
      # This assumes that each product_option_values is an array of values
      product_options.reduce([]) do |combinations, option|
        option_values = option[:product_option_values]
        next combinations if option_values.empty?
    
        if combinations.empty?
          combinations = option_values.map { |value| { option[:product_option_name] => value } }
        else
          combinations = combinations.flat_map do |combination|
            option_values.map { |value| combination.merge(option[:product_option_name] => value) }
          end
        end
    
        # Add SKU and price inputs to each variant
        combinations.each { |variant| variant.merge!({ 'sku' => '', 'price' => '' }) }
    
        # Update existing variants with their corresponding values
        combinations.each do |variant|
          existing_variant = existing_variants.find { |existing| existing.slice(*option_values.map { |ov| option[:product_option_name] }) == variant.slice(*option_values.map { |ov| option[:product_option_name] }) }
          if existing_variant
            variant['sku'] = existing_variant['sku']
            variant['price'] = existing_variant['price']
          end
        end
    
        combinations
      end
    end
    
    
end
