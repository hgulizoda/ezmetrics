import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

import { ClockType } from '../common/enums/clock-type.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type ClockRecordDocument = HydratedDocument<ClockRecord>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'clock_records',
})
export class ClockRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'workers', required: true })
  worker_id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  clock_in: Date

  @Prop()
  clock_out?: Date

  @Prop({ type: String, enum: ClockType, default: ClockType.AUTO })
  clock_type: ClockType

  @Prop()
  note?: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  edited_by?: MongooseSchema.Types.ObjectId

  @Prop()
  original_clock_in?: Date

  @Prop()
  original_clock_out?: Date

  @Prop()
  edit_note?: string

  @Prop({ default: false })
  is_grace_period: boolean
}

export const ClockRecordSchema = SchemaFactory.createForClass(ClockRecord)
