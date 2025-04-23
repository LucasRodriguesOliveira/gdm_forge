import mongoose, { Document, ObjectId } from 'mongoose';

export const ContactSchema = new mongoose.Schema({
  oldid: Number,
  name: String,
  phone: String,
  state: String,
  userId: String,
});

export const contactSchemaName = 'Contact';

export interface IContactModel extends Document {
  readonly _id: ObjectId;
  readonly oldid: number;
  readonly name: string;
  readonly phone: string;
  readonly state: string;
  readonly userId: string;
}
