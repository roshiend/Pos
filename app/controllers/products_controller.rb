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
   
     @option_types = OptionType.all
     @option_values = OptionValue.all
    
    # @option_types.each do |option_type|
    #   unless @product.option_types.include?(option_type)
    #     @product.product_option_type_values.build(option_type: option_type)
    #   end
    # end
  end

  # GET /products/1/edit
  def edit
    @product = Product.find(params[:id])
   
    @option_types = OptionType.all
    @option_values = OptionValue.all
    # Ensure there's a product_option_type_value for each option_type
    if @product.product_option_type_values.blank?
      @product.product_option_type_values.build
    end
  end


  # POST /products or /products.json
  def create
    @product = Product.new(product_params)
    if @product.save
      @product.generate_variants
      redirect_to @product, notice: 'Product was successfully created.'
    else
      @option_types = OptionType.all.includes(:option_values)
      render :new
    end
  end

  # PATCH/PUT /products/1 or /products/1.json
  def update
   
    if @product.update(product_params)
      
      redirect_to @product, notice: 'Product was successfully updated.'
    else
      render :edit
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

   


    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:name, :description,:master_price,product_option_type_values_attributes:[:id,:_destroy,:product_option_name,product_option_values: []])
    end
  end
