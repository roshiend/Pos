class CombinationsController < ApplicationController
  before_action :set_combination, only: %i[ show edit update destroy ]

  # GET /combinations or /combinations.json
  def index
    @combinations = Combination.all
  end

  # GET /combinations/1 or /combinations/1.json
  def show
  end

  # GET /combinations/new
  def new
    @combination = Combination.new
  end

  # GET /combinations/1/edit
  def edit
  end

  # POST /combinations or /combinations.json
  def create
    @combination = Combination.new(combination_params)

    respond_to do |format|
      if @combination.save
        format.html { redirect_to combination_url(@combination), notice: "Combination was successfully created." }
        format.json { render :show, status: :created, location: @combination }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @combination.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /combinations/1 or /combinations/1.json
  def update
    respond_to do |format|
      if @combination.update(combination_params)
        format.html { redirect_to combination_url(@combination), notice: "Combination was successfully updated." }
        format.json { render :show, status: :ok, location: @combination }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @combination.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /combinations/1 or /combinations/1.json
  def destroy
    @combination.destroy

    respond_to do |format|
      format.html { redirect_to combinations_url, notice: "Combination was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_combination
      @combination = Combination.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def combination_params
      params.require(:combination).permit(:option_combination)
    end
end
