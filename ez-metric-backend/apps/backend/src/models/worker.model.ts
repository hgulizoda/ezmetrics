import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

import { SalaryType } from '../common/enums/salary-type.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type WorkerDocument = HydratedDocument<Worker>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'workers',
})
export class Worker {
  @Prop({ required: true })
  name: string

  @Prop()
  photo_url?: string

  @Prop()
  position?: string

  @Prop()
  language?: string

  @Prop({ type: String, enum: SalaryType, required: true })
  salary_type: SalaryType

  @Prop({ required: true })
  salary_rate: number

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'shifts' })
  shift_id?: MongooseSchema.Types.ObjectId

  @Prop({ default: true })
  is_active: boolean

  @Prop()
  deleted_at?: Date
}

export const WorkerSchema = SchemaFactory.createForClass(Worker)
