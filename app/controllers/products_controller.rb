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
  end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)

    respond_to do |format|
      if @product.save
        format.html { redirect_to product_url(@product), notice: "Product was successfully created." }
        format.json { render :show, status: :created, location: @product }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1 or /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to product_url(@product), notice: "Product was successfully updated." }
        format.json { render :show, status: :ok, location: @product }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1 or /products/1.json
  def destroy
    @product.destroy

    respond_to do |format|
      format.html { redirect_to products_url, notice: "Product was successfully destroyed." }
      format.json { head :no_content }
    end
  end

 
  def create_variants
    product_options = params[:product_options]
  
    # Filter out empty strings from product_option_values
    options_values = product_options.map { |option| option[:product_option_values].reject(&:empty?) }
  
    # Check if there are any values left after filtering
    if options_values.any?
      # Generate Cartesian product
      cartesian_product = options_values.shift.product(*options_values)
  
      # Transform the Cartesian product into an array of hashes
      @combinations = cartesian_product.map.with_index do |combination, index|
        variant_hash = {}
  
        product_options.each_with_index do |option, option_index|
          variant_hash[option[:product_option_name]] = combination[option_index]
        end
  
        { id: index, values: variant_hash }
      end
    else
      # No values left, handle accordingly (e.g., clear or set @combinations to an empty array)
      @combinations = []
    end
  
    # Respond with the generated variants
   # render partial: 'variants', locals: { combinations: @combinations }
    render partial: 'variants', locals: { combinations: @combinations}
   
  end
  


  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

     # Only allow a list of trusted parameters through.
     def product_params
      params.require(:product).permit(:name, :description, variants_attributes: [:id, :sku, :price],product_options_attributes:[:id,:_destroy,:product_option_name,product_option_values: []])
    end

end
