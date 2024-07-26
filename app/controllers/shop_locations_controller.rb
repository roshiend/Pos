class ShopLocationsController < ApplicationController
  before_action :set_shop_location, only: %i[ show edit update destroy ]

  # GET /shop_locations or /shop_locations.json
  def index
    @shop_locations = ShopLocation.all
  end

  # GET /shop_locations/1 or /shop_locations/1.json
  def show
  end

  # GET /shop_locations/new
  def new
    @shop_location = ShopLocation.new
  end

  # GET /shop_locations/1/edit
  def edit
  end

  # POST /shop_locations or /shop_locations.json
  def create
    @shop_location = ShopLocation.new(shop_location_params)

    respond_to do |format|
      if @shop_location.save
        format.html { redirect_to shop_location_url(@shop_location), notice: "Shop location was successfully created." }
        format.json { render :show, status: :created, location: @shop_location }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @shop_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /shop_locations/1 or /shop_locations/1.json
  def update
    respond_to do |format|
      if @shop_location.update(shop_location_params)
        format.html { redirect_to shop_location_url(@shop_location), notice: "Shop location was successfully updated." }
        format.json { render :show, status: :ok, location: @shop_location }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @shop_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /shop_locations/1 or /shop_locations/1.json
  def destroy
    @shop_location.destroy

    respond_to do |format|
      format.html { redirect_to shop_locations_url, notice: "Shop location was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shop_location
      @shop_location = ShopLocation.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def shop_location_params
      params.require(:shop_location).permit(:name, :code)
    end
end
