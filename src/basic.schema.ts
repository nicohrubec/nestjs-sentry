import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { generateUuidV4 } from 'nestjs-uuid/dist/lib/uuid.utils';

export type BasicDocument = HydratedDocument<Basic>;

@Schema()
export class Basic {
  @Prop({ default: generateUuidV4 })
  _id: string;

  @Prop({ required: true })
  description: string;
}

export const BasicSchema = SchemaFactory.createForClass(Basic);
