import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Contact {
  @Prop()
  oldid: number;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  state: string;

  @Prop()
  userId: string;
}

export type ContactDocument = HydratedDocument<Contact>;

export const ContactSchema = SchemaFactory.createForClass(Contact);
