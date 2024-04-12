class OptionValueVariantsController < ApplicationController
  before_action :set_option_value_variant, only: %i[ show edit update destroy ]

  # GET /option_value_variants or /option_value_variants.json
  def index
    @option_value_variants = OptionValueVariant.all
  end

  # GET /option_value_variants/1 or /option_value_variants/1.json
  def show
  end

  # GET /option_value_variants/new
  def new
    @option_value_variant = OptionValueVariant.new
  end

  # GET /option_value_variants/1/edit
  def edit
  end

  # POST /option_value_variants or /option_value_variants.json
  def create
    @option_value_variant = OptionValueVariant.new(option_value_variant_params)

    respond_to do |format|
      if @option_value_variant.save
        format.html { redirect_to option_value_variant_url(@option_value_variant), notice: "Option value variant was successfully created." }
        format.json { render :show, status: :created, location: @option_value_variant }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @option_value_variant.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /option_value_variants/1 or /option_value_variants/1.json
  def update
    respond_to do |format|
      if @option_value_variant.update(option_value_variant_params)
        format.html { redirect_to option_value_variant_url(@option_value_variant), notice: "Option value variant was successfully updated." }
        format.json { render :show, status: :ok, location: @option_value_variant }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @option_value_variant.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /option_value_variants/1 or /option_value_variants/1.json
  def destroy
    @option_value_variant.destroy

    respond_to do |format|
      format.html { redirect_to option_value_variants_url, notice: "Option value variant was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_option_value_variant
      @option_value_variant = OptionValueVariant.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def option_value_variant_params
      params.fetch(:option_value_variant, {})
    end
end
