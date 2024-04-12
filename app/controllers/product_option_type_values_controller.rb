class ProductOptionTypeValuesController < ApplicationController
  before_action :set_product_option_type_value, only: %i[ show edit update destroy ]

  # GET /product_option_type_values or /product_option_type_values.json
  def index
    @product_option_type_values = ProductOptionTypeValue.all
  end

  # GET /product_option_type_values/1 or /product_option_type_values/1.json
  def show
  end

  # GET /product_option_type_values/new
  def new
    @product_option_type_value = ProductOptionTypeValue.new
  end

  # GET /product_option_type_values/1/edit
  def edit
  end

  # POST /product_option_type_values or /product_option_type_values.json
  def create
    @product_option_type_value = ProductOptionTypeValue.new(product_option_type_value_params)

    respond_to do |format|
      if @product_option_type_value.save
        format.html { redirect_to product_option_type_value_url(@product_option_type_value), notice: "Product option type value was successfully created." }
        format.json { render :show, status: :created, location: @product_option_type_value }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product_option_type_value.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /product_option_type_values/1 or /product_option_type_values/1.json
  def update
    respond_to do |format|
      if @product_option_type_value.update(product_option_type_value_params)
        format.html { redirect_to product_option_type_value_url(@product_option_type_value), notice: "Product option type value was successfully updated." }
        format.json { render :show, status: :ok, location: @product_option_type_value }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @product_option_type_value.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /product_option_type_values/1 or /product_option_type_values/1.json
  def destroy
    @product_option_type_value.destroy

    respond_to do |format|
      format.html { redirect_to product_option_type_values_url, notice: "Product option type value was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product_option_type_value
      @product_option_type_value = ProductOptionTypeValue.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_option_type_value_params
      params.fetch(:product_option_type_value, {})
    end
end
