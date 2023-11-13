import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { AirQuality } from '../schemas/air_quality.schema';
import { AirQualityService } from '..//services';
import { CONSTANTS } from '../utils/constant';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @Inject(forwardRef(() => AirQualityService))
    private readonly airQualityService: AirQualityService,
    @InjectModel(AirQuality.name) private airQualityModel: Model<AirQuality>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const { data } = await this.airQualityService.getAirQuality({
      longitude: parseFloat(CONSTANTS.LONGITUDE),
      latitude: parseFloat(CONSTANTS.LATITUDE),
    });
    this.airQualityModel.create(data);

    this.logger.debug('CRON JOB RUN EVERY 1 MINUTE');
  }
}
