import { Module } from '@nestjs/common';
import { JobsService } from '../services';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQuality, AirQualitySchema } from '../schemas/air_quality.schema';
import { AirQualityModule } from './air_quality.module';

@Module({
  imports: [
    AirQualityModule,
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
  ],
  providers: [JobsService],
})
export class JobsModule {}
