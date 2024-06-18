class OptionTypesController < ApplicationController
  before_action :set_option_type, only: %i[ show edit update destroy ]

  # GET /option_types or /option_types.json
  def index
    @option_types = OptionType.all
  end

  # GET /option_types/1 or /option_types/1.json
  def show
  end

  # GET /option_types/new
  def new
    @option_type = OptionType.new
    
  end

  # GET /option_types/1/edit
  def edit
  end

  # POST /option_types or /option_types.json
  def create
    @option_type = OptionType.new(option_type_params)

    respond_to do |format|
      if @option_type.save
        format.html { redirect_to option_type_url(@option_type), notice: "Option type was successfully created." }
        format.json { render :show, status: :created, location: @option_type }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @option_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /option_types/1 or /option_types/1.json
  def update
    respond_to do |format|
      if @option_type.update(option_type_params)
        format.html { redirect_to option_type_url(@option_type), notice: "Option type was successfully updated." }
        format.json { render :show, status: :ok, location: @option_type }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @option_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /option_types/1 or /option_types/1.json
  def destroy
    @option_type.destroy

    respond_to do |format|
      format.html { redirect_to option_types_url, notice: "Option type was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_option_type
      @option_type = OptionType.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def option_type_params
      params.require(:option_type).permit(:name)
    end

end
