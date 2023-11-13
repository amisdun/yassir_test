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
import { HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { mockAirQualityData } from './mocks';

describe('Controller', () => {
  let controller: AirQualityController;
  let service: AirQualityService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let airQualityModel: Model<AirQuality>;
  let httpService: DeepMocked<HttpService>;

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
      ],
      controllers: [AirQualityController],
      providers: [
        AirQualityService,
        {
          provide: getModelToken(AirQuality.name),
          useValue: airQualityModel,
        },
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    controller = app.get<AirQualityController>(AirQualityController);
    service = app.get<AirQualityService>(AirQualityService);

    httpService = app.get(HttpService);
    httpService.axiosRef.mockResolvedValue({ ...mockAirQualityData });
  });

  beforeEach(() => {
    jest.spyOn(service, 'getAirQuality');
    jest.spyOn(service, 'formatAirQualityDataResponse');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  describe('get air_quality by coordinates', () => {
    it('getAirQuality should be called', async () => {
      await controller.getAirQuality({
        longitude: 2.352222,
        latitude: 48.856613,
      });

      expect(service.getAirQuality).toHaveBeenCalled();
      expect(service.getAirQuality).toHaveBeenCalledTimes(1);
    });

    it('getAirQuality should be called with arguments', async () => {
      await controller.getAirQuality({
        longitude: 2.352222,
        latitude: 48.856613,
      });

      expect(service.getAirQuality).toHaveBeenCalledWith({
        longitude: 2.352222,
        latitude: 48.856613,
      });
    });

    it('formatAirQualityDataResponse should be called', async () => {
      await controller.getAirQuality({
        longitude: 2.352222,
        latitude: 48.856613,
      });

      expect(service.formatAirQualityDataResponse).toHaveBeenCalled();
      expect(service.formatAirQualityDataResponse).toHaveBeenCalledTimes(1);
    });
  });
});
