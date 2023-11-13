import { Module } from '@nestjs/common';
import { JobsModule, AirQualityModule } from './modules';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    JobsModule,
    AirQualityModule,
    ScheduleModule.forRoot(),
  ],
})
export class MainModule {}
