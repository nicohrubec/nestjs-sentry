import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type BasicDocument = HydratedDocument<Basic>;

@Schema()
export class Basic {
  @Prop()
  id: string;

  @Prop({ required: true })
  description: string;
}

export const BasicSchema = SchemaFactory.createForClass(Basic);
