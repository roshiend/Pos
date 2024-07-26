class ListingTypesController < ApplicationController
  before_action :set_listing_type, only: %i[ show edit update destroy ]

  # GET /listing_types or /listing_types.json
  def index
    @listing_types = ListingType.all
  end

  # GET /listing_types/1 or /listing_types/1.json
  def show
  end

  # GET /listing_types/new
  def new
    @listing_type = ListingType.new
  end

  # GET /listing_types/1/edit
  def edit
  end

  # POST /listing_types or /listing_types.json
  def create
    @listing_type = ListingType.new(listing_type_params)

    respond_to do |format|
      if @listing_type.save
        format.html { redirect_to listing_type_url(@listing_type), notice: "Listing type was successfully created." }
        format.json { render :show, status: :created, location: @listing_type }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @listing_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /listing_types/1 or /listing_types/1.json
  def update
    respond_to do |format|
      if @listing_type.update(listing_type_params)
        format.html { redirect_to listing_type_url(@listing_type), notice: "Listing type was successfully updated." }
        format.json { render :show, status: :ok, location: @listing_type }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @listing_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /listing_types/1 or /listing_types/1.json
  def destroy
    @listing_type.destroy

    respond_to do |format|
      format.html { redirect_to listing_types_url, notice: "Listing type was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_listing_type
      @listing_type = ListingType.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def listing_type_params
      params.require(:listing_type).permit(:name, :code)
    end
end
