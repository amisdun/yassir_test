import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { AirQuality } from '../schemas/air_quality.schema';
import { CONSTANTS } from '../utils/constant';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AirQualityService {
  constructor(
    public httpService: HttpService,
    @InjectModel(AirQuality.name) private airQualityModel: Model<AirQuality>,
  ) {}

  async getAirQuality({
    longitude,
    latitude,
  }: {
    longitude: number;
    latitude: number;
  }): Promise<AxiosResponse<{ status: string; data: AirQuality }>> {
    const params = {
      lon: String(longitude),
      lat: String(latitude),
      key: process.env.AIR_QUALITY_API_KEY,
    };

    if (!params.key) {
      throw new NotFoundException('AIR_QUALITY_API_KEY not found');
    }
    const searchParams = new URLSearchParams(params).toString();

    try {
      const { data } = await this.httpService.axiosRef({
        url: `${process.env.AIR_QUALITY_BASE_URL}nearest_city?${searchParams}`,
        method: 'GET',
      });

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  formatAirQualityDataResponse(data: Record<string, any>): Record<string, any> {
    const {
      data: {
        current: { pollution: Pollution },
      },
    } = data;

    return { Result: { Pollution } };
  }

  async getMostPollutedAir(): Promise<Record<string, any>> {
    const response = await this.airQualityModel.aggregate([
      { $match: { city: 'Paris' } },
      {
        $group: {
          _id: '$city',
          highestPollutedValue: { $max: '$current.pollution.aqius' },
          dateTimeOfHighestPollutedValue: { $first: '$current.pollution.ts' },
        },
      },
    ]);

    return {
      Result: {
        dateTimeOfHighestPollutedValue:
          response[0]?.dateTimeOfHighestPollutedValue,
      },
    };
  }
}
