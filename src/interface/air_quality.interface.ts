import { IsNotEmpty } from 'class-validator';

export class AirQualityDto {
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;
}
