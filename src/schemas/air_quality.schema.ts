import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AirQualityDocument = HydratedDocument<AirQuality>;

@Schema({ timestamps: true, collection: 'air_qualities' })
export class AirQuality {
  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop(
    raw({
      type: { type: String },
      coordinates: { type: [Number] },
    }),
  )
  location: Record<string, any>;

  @Prop(
    raw({
      pollution: {
        ts: { type: String },
        aqius: { type: Number },
        mainus: { type: String },
        aqicn: { type: Number },
        maincn: { type: String },
      },
      weather: {
        ts: { type: String },
        tp: { type: Number },
        pr: { type: Number },
        hu: { type: Number },
        ws: { type: Number },
        wd: { type: Number },
        ic: { type: String },
      },
    }),
  )
  current: Record<string, any>;
}

export const AirQualitySchema = SchemaFactory.createForClass(AirQuality);
