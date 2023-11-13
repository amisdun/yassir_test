import { AirQualityController } from '../src/controllers/air_quality.controller';
import { AirQualityService } from '../src/services/air_quality.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AirQuality,
  AirQualitySchema,
} from '../src/schemas/air_quality.schema';
import { getModelToken } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('Integration', () => {
  let controller: AirQualityController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let airQualityModel: Model<AirQuality>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    airQualityModel = mongoConnection.model(AirQuality.name, AirQualitySchema);

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        HttpModule,
      ],
      controllers: [AirQualityController],
      providers: [
        AirQualityService,
        {
          provide: getModelToken(AirQuality.name),
          useValue: airQualityModel,
        },
      ],
    }).compile();

    controller = app.get<AirQualityController>(AirQualityController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  describe('Integration test to get quality air', () => {
    it('test getAirQuality returns correct data', async () => {
      const response = await controller.getAirQuality({
        longitude: 2.352222,
        latitude: 48.856613,
      });

      expect(response).toHaveProperty('Result');
      expect(response.Result).toHaveProperty('Pollution');
      expect(response.Result.Pollution).toHaveProperty('ts');
      expect(response.Result.Pollution).toHaveProperty('aqius');
      expect(response.Result.Pollution).toHaveProperty('mainus');
      expect(response.Result.Pollution).toHaveProperty('aqicn');
      expect(response.Result.Pollution).toHaveProperty('maincn');

      expect(response.Result.Pollution.ts).toBeDefined();
      expect(response.Result.Pollution.maincn).toBeDefined();
      expect(response.Result.Pollution.aqius).toBeDefined();
      expect(response.Result.Pollution.aqicn).toBeDefined();
      expect(response.Result.Pollution.mainus).toBeDefined();
    });

    it('test controller to get data time for most polluted air', async () => {
      const response = await controller.getMostPollutedAir();

      expect(response).toHaveProperty('Result');
      expect(response.Result).toHaveProperty('dateTimeOfHighestPollutedValue');
    });
  });
});
