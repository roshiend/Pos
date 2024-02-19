class OptionValuesController < ApplicationController
  before_action :set_option_value, only: %i[ show edit update destroy ]

  # GET /option_values or /option_values.json
  def index
    option = Option.find(params[:option_id])
    @option_values = option.option_values

    respond_to do |format|
      format.json { render json: @option_values }
    end
    
  end

  # GET /option_values/1 or /option_values/1.json
  def show
  end

  # GET /option_values/new
  def new
    @option_value = OptionValue.new
  end

  # GET /option_values/1/edit
  def edit
  end

  # POST /option_values or /option_values.json
  def create
    @option_value = OptionValue.new(option_value_params)

    respond_to do |format|
      if @option_value.save
        format.html { redirect_to option_value_url(@option_value), notice: "Option value was successfully created." }
        format.json { render :show, status: :created, location: @option_value }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @option_value.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /option_values/1 or /option_values/1.json
  def update
    respond_to do |format|
      if @option_value.update(option_value_params)
        format.html { redirect_to option_value_url(@option_value), notice: "Option value was successfully updated." }
        format.json { render :show, status: :ok, location: @option_value }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @option_value.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /option_values/1 or /option_values/1.json
  def destroy
    @option_value.destroy

    respond_to do |format|
      format.html { redirect_to option_values_url, notice: "Option value was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_option_value
      @option_value = OptionValue.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def option_value_params
      params.require(:option_value).permit(:value)
    end
end
