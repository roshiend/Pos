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
    @variants = @product.variants.all  # Load all existing variants
    @combinations = @product.variants.map(&:combinations).map(&:first).map(&:option_combination) 
    #render partial: 'variants', locals: { combinations: @combinations }
  end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)
  
    if @product.save
      #Create variants with associated combinations
      variant_options = params[:product][:variants_attributes]
      variant_options.each do |index, options|
        sku = options[:sku]
        price = options[:price]
        combination = options[:combinations_attributes].values.first[:option_combination]
  
        variant = @product.variants.find_or_initialize_by(sku: sku, price: price)
        combination = variant.combinations.find_or_initialize_by(option_combination: combination)
        combination.save
      end
  
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
  
    # Parse the received JSON data
    # Assuming product_options is an array of hashes with keys :product_option_name and :product_option_values
    @combinations = generate_variants(product_options)
    
    @combinations.each do |combination|
      
      puts "-------->#{combination}"
     
    end
    #redirect_to new_variant_path(combinations: @combinations)
    render partial: 'variants', locals: { combinations: @combinations }
    
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
      params.require(:product).permit(:name, :description, variants_attributes: [:id, :sku, :price,:unique_id,combinations_attributes: [
        :option_combination
      ]],product_options_attributes:[:id,:_destroy,:product_option_name,product_option_values: []])
    end
    
    def generate_variants(product_options)
      return [] if product_options.blank?
    
      combinations = [[]]
    
      product_options.values.each do |option|
        option_values = option[:product_option_values]
        next if option_values.blank?
    
        combinations = combinations.flat_map do |combination|
          option_values.map do |value|
            combination + [value]
          end
        end
      end
    
      combinations.map { |variant| variant.join(' / ') }
    end

end
