import { Module } from '@nestjs/common';
import { AirQualityService } from '../services';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQuality, AirQualitySchema } from '../schemas/air_quality.schema';
import { AirQualityController } from '../controllers/air_quality.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
  ],
  controllers: [AirQualityController],
  providers: [AirQualityService],
  exports: [AirQualityService],
})
export class AirQualityModule {}
