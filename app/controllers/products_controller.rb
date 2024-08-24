class ProductsController < ApplicationController
  before_action :set_product, only: %i[ show edit update destroy ]
 
  # GET /products or /products.json
  def index
    @products = Product.includes(:option_types, :variants).all
  
    render json: @products.as_json(include: { 
      option_types: {  }, 
      variants: {}
    })
   
  end

  # GET /products/1 or /products/1.json
  def show
    # @products = Product.includes(:option_types, :variants).all
  
    # render json: @products.as_json(include: { 
    #   option_types: { }, 
    #   variants: {}
    # })
  end

  # GET /products/new
  def new
    @product = Product.new
    @option_types = OptionTypeSet.all
    
  end

  # GET /products/1/edit
  def edit
    @option_type_set = Rails.cache.fetch('option_type_set', expires_in: 12.hours) do
      OptionTypeSet.all.to_a
    end
    
  end

  def create
    #logger.debug "Product params: #{product_params.inspect}"
    
    @product = Product.new(product_params)
    #process_option_values(@product)
    if @product.save
      
      redirect_to @product, notice: 'Product was successfully created.'
    else
      logger.debug "Product errors: #{@product.errors.full_messages}"
      render :new
    end
  end
  
    
  
    # PATCH/PUT /products/1 or /products/1.json
    def update
      
     
      respond_to do |format|
        
        if @product.update(product_params)
          format.html { redirect_to @product, notice: 'Product was successfully updated.' }
          format.json { render :show, status: :ok, location: @product }
        else
          format.html { render :edit }
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


  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:name,:description,:master_price,:product_type_id, :category_id, :sub_category_id, :shop_location_id, :listing_type_id, :vendor_id,variants_attributes: [:id,:option1, :option2, :option3, :sku, :price,:unique_id,:barcode,:position,:title,:_destroy],option_types_attributes:[:id,:name,:_destroy,:position,value:[]])
    end

    
   
  
end