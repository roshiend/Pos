class SubCatogoriesController < ApplicationController
  before_action :set_sub_catogory, only: %i[ show edit update destroy ]

  # GET /sub_catogories or /sub_catogories.json
  def index
    @sub_catogories = SubCatogory.all
  end

  # GET /sub_catogories/1 or /sub_catogories/1.json
  def show
  end

  # GET /sub_catogories/new
  def new
    @sub_catogory = SubCatogory.new
  end

  # GET /sub_catogories/1/edit
  def edit
  end

  # POST /sub_catogories or /sub_catogories.json
  def create
    @sub_catogory = SubCatogory.new(sub_catogory_params)

    respond_to do |format|
      if @sub_catogory.save
        format.html { redirect_to sub_catogory_url(@sub_catogory), notice: "Sub catogory was successfully created." }
        format.json { render :show, status: :created, location: @sub_catogory }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @sub_catogory.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sub_catogories/1 or /sub_catogories/1.json
  def update
    respond_to do |format|
      if @sub_catogory.update(sub_catogory_params)
        format.html { redirect_to sub_catogory_url(@sub_catogory), notice: "Sub catogory was successfully updated." }
        format.json { render :show, status: :ok, location: @sub_catogory }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @sub_catogory.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sub_catogories/1 or /sub_catogories/1.json
  def destroy
    @sub_catogory.destroy

    respond_to do |format|
      format.html { redirect_to sub_catogories_url, notice: "Sub catogory was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sub_catogory
      @sub_catogory = SubCatogory.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def sub_catogory_params
      params.require(:sub_catogory).permit(:name)
    end
end
