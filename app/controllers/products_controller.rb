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
    #@product.variants.build
  end

  # GET /products/1/edit
  def edit
  end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)
    
    respond_to do |format|
      if @product.save
       # @product.generate_variants
      # @product.update_or_create_variants(combine_option_values)
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
    @product = Product.new
    # option_type_attributes = params[:option_type_attributes]
    # combinations = []
  
    # option_type_attributes.each do |_, option_type_data|
    #   current_combination = []
    #   option_type_data[:option_values_attributes].each do |_, option_value_data|
    #     current_combination.push(option_value_data[:name])
    #   end
    #   combinations.push(current_combination) unless current_combination.empty?
    #   puts "combinations---->#{combinations}"
    # end
  
    # respond_to do |format|
    #   format.turbo_stream do
    #     render turbo_stream: turbo_stream.replace("variants-container", partial: "variants", locals: { combinations: combinations })
    #   end
    #   format.html { redirect_to some_path } # Handle other formats if necessary
    # end
    combinations = Product.prepare_option_value_combinations(params[:option_type_attributes])
    puts "combinations---->#{combinations}"
self.create_unique_variants(combinations)

  end
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:name,:description,:master_price,variants_attributes: [:id, :sku, :price,:unique_id],option_types_attributes:[:id,:name,:_destroy,option_values_attributes: [:id,{name:[]}]])
    end

    # def prepare_option_value_combinations(option_type_attributes)
    #   combinations = [[]]
    #   option_type_attributes.option_types.each do |option_type|
    #     current_combination = []
    #     option_type.option_values.each do |option_value|
    #       current_combination.push(option_value.id)
    #     end
    #     combinations.push(current_combination) unless current_combination.empty?
    #   end
    #   combinations
    # end
end
