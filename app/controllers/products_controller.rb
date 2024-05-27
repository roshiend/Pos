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
     @product = Product.find_or_initialize_by(params[:product_id])

     combinations = Product.generate_combinations(params[:option_type_attributes])
   
    
     #combinations.map! { |variant| variant.join(' / ') }

    #puts "combinations---->#{combinations}"
    

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("variants-container", partial: "products/variants", locals: { combinations: combinations, product: @product })
      end
      format.html { redirect_to some_path } # Handle other formats if necessary
    end
  end
  
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:name,:description,:master_price,variants_attributes: [:id, :sku, :price,:unique_id],option_types_attributes:[:id,:name,:_destroy,option_values_attributes: [:id,name:[]]])
    end

    
    
    


    
    
    


    
    
     

    
end