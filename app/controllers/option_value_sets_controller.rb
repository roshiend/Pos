class OptionValueSetsController < ApplicationController
  before_action :set_option_value_set, only: %i[ show edit update destroy ]

  # GET /option_value_sets or /option_value_sets.json
  def index
    @option_value_sets = OptionValueSet.all
  end

  # GET /option_value_sets/1 or /option_value_sets/1.json
  def show
  end

  # GET /option_value_sets/new
  def new
    @option_value_set = OptionValueSet.new
  end

  # GET /option_value_sets/1/edit
  def edit
  end

  # POST /option_value_sets or /option_value_sets.json
  def create
    @option_value_set = OptionValueSet.new(option_value_set_params)

    respond_to do |format|
      if @option_value_set.save
        format.html { redirect_to option_value_set_url(@option_value_set), notice: "Option value set was successfully created." }
        format.json { render :show, status: :created, location: @option_value_set }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @option_value_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /option_value_sets/1 or /option_value_sets/1.json
  def update
    respond_to do |format|
      if @option_value_set.update(option_value_set_params)
        format.html { redirect_to option_value_set_url(@option_value_set), notice: "Option value set was successfully updated." }
        format.json { render :show, status: :ok, location: @option_value_set }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @option_value_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /option_value_sets/1 or /option_value_sets/1.json
  def destroy
    @option_value_set.destroy

    respond_to do |format|
      format.html { redirect_to option_value_sets_url, notice: "Option value set was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_option_value_set
      @option_value_set = OptionValueSet.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def option_value_set_params
      params.fetch(:option_value_set, {})
    end
end
