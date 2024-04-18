class OptionTypeSetsController < ApplicationController
  before_action :set_option_type_set, only: %i[ show edit update destroy ]

  # GET /option_type_sets or /option_type_sets.json
  def index
    @option_type_sets = OptionTypeSet.all
  end

  # GET /option_type_sets/1 or /option_type_sets/1.json
  def show
  end

  # GET /option_type_sets/new
  def new
    @option_type_set = OptionTypeSet.new
  end

  # GET /option_type_sets/1/edit
  def edit
  end

  # POST /option_type_sets or /option_type_sets.json
  def create
    @option_type_set = OptionTypeSet.new(option_type_set_params)

    respond_to do |format|
      if @option_type_set.save
        format.html { redirect_to option_type_set_url(@option_type_set), notice: "Option type set was successfully created." }
        format.json { render :show, status: :created, location: @option_type_set }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @option_type_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /option_type_sets/1 or /option_type_sets/1.json
  def update
    respond_to do |format|
      if @option_type_set.update(option_type_set_params)
        format.html { redirect_to option_type_set_url(@option_type_set), notice: "Option type set was successfully updated." }
        format.json { render :show, status: :ok, location: @option_type_set }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @option_type_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /option_type_sets/1 or /option_type_sets/1.json
  def destroy
    @option_type_set.destroy

    respond_to do |format|
      format.html { redirect_to option_type_sets_url, notice: "Option type set was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_option_type_set
      @option_type_set = OptionTypeSet.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def option_type_set_params
      params.fetch(:option_type_set, {})
    end
end
