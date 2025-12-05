import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Stream extends Document {
  @Prop({ unique: true })
  streamId: string; //from yt or twitch
  @Prop()
  title: string;

  @Prop()
  creatorName: string;

  @Prop()
  platform: string; // yt or twitch

  @Prop()
  viewers: number;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
