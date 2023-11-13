import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from '../services';
import { AirQualityDto } from '../interface/air_quality.interface';

@Controller()
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get('/air_quality_by_coordinates')
  async getAirQuality(@Query() airQualityParams: AirQualityDto) {
    const data = await this.airQualityService.getAirQuality(airQualityParams);
    return this.airQualityService.formatAirQualityDataResponse(data);
  }

  @Get('/most_polluted_datetime')
  getMostPollutedAir() {
    return this.airQualityService.getMostPollutedAir();
  }
}
