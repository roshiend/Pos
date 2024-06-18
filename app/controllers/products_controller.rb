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
    @option_types = OptionTypeSet.all
    
  end

  # GET /products/1/edit
  def edit
    @option_types = OptionTypeSet.all
  end

 # POST /products or /products.json
def create
  @product = Product.new(product_params.except(:option_types_attributes))

  if params[:product][:option_types_attributes].present?
    params[:product][:option_types_attributes].each do |index, option_type_params|
      next if option_type_params[:_destroy] == '1' # Skip any marked for destruction

      if option_type_params[:name].present?
        ot = @product.option_types.find_or_initialize_by(name: option_type_params[:name])

        if option_type_params[:option_values_attributes].present?
          option_type_params[:option_values_attributes].each do |i, option_value_params|
            if option_value_params[:name].present?
              option_value_params[:name].each do |name|
                ov = ot.option_values.find_or_initialize_by(name: name)
                ov.save if ov.new_record? || ov.changed?
              end
            end
          end
        end
      end
    end
  end

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
  @product = Product.find(params[:id])

  if @product.update(product_params.except(:option_types_attributes))
    if params[:product][:option_types_attributes].present?
      params[:product][:option_types_attributes].each do |index, option_type_params|
        if option_type_params[:_destroy] == '1'
          ot = @product.option_types.find(option_type_params[:id])
          ot.destroy if ot
          next
        end

        if option_type_params[:name].present?
          ot = @product.option_types.find_or_initialize_by(id: option_type_params[:id])

          ot.update(name: option_type_params[:name])

          if option_type_params[:option_values_attributes].present?
            option_type_params[:option_values_attributes].each do |i, option_value_params|
              if option_value_params[:_destroy] == '1'
                ov = ot.option_values.find(option_value_params[:id])
                ov.destroy if ov
                next
              end

              if option_value_params[:name].present?
                option_value_params[:name].each do |name|
                  ov = ot.option_values.find_or_initialize_by(id: option_value_params[:id], name: name)
                  ov.update(name: name) if ov.new_record? || ov.changed?
                end
              end
            end
          end
        end
      end
    end

    respond_to do |format|
      format.html { redirect_to product_url(@product), notice: "Product was successfully updated." }
      format.json { render :show, status: :ok, location: @product }
    end
  else
    respond_to do |format|
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
    #@product = Product.find_or_initialize_by(params[:product_id])

    # combinations = Product.generate_combinations(params[:option_type_attributes])
   
    
     #combinations.map! { |variant| variant.join(' / ') }

    #puts "combinations---->#{combinations}"
    

    # respond_to do |format|
    #   format.turbo_stream do
    #     render turbo_stream: turbo_stream.replace("variants-container", partial: "products/variants", locals: { combinations: combinations, product: @product })
    #   end
    #   format.html { redirect_to some_path } # Handle other formats if necessary
    # end
  end
  
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:name,:description,:master_price,variants_attributes: [:id, :sku, :price,:unique_id],option_types_attributes:[:id,:name,:_destroy,option_values_attributes: [:id,{ name:[ ] }, :_destroy]])
    end

    

    
    
    


    
    
    


    
    
     

    
end