import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

import { COLLECTION_TIMESTAMPS } from '../constants'

export type ShiftDocument = HydratedDocument<Shift>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'shifts',
})
export class Shift {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  start_time: string

  @Prop({ required: true })
  end_time: string

  @Prop({ default: 0 })
  break_duration_minutes: number

  @Prop({ default: true })
  is_active: boolean

  @Prop()
  deleted_at?: Date
}

export const ShiftSchema = SchemaFactory.createForClass(Shift)
