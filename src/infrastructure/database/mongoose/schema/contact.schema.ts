import mongoose, { Document } from 'mongoose';

export const ContactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  phone: String,
  state: String,
});

export const contactSchemaName = 'Contact';

export interface IContactModel extends Document {
  readonly id: number;
  readonly name: string;
  readonly phone: string;
  readonly state: string;
}
