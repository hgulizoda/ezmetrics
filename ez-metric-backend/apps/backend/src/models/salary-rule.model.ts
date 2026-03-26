import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

import { SalaryType } from '../common/enums/salary-type.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type SalaryRuleDocument = HydratedDocument<SalaryRule>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'salary_rules',
})
export class SalaryRule {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'workers', required: true })
  worker_id: MongooseSchema.Types.ObjectId

  @Prop({ type: String, enum: SalaryType, required: true })
  rate_type: SalaryType

  @Prop({ required: true })
  rate_value: number

  @Prop({ default: 1.5 })
  overtime_multiplier: number

  @Prop({ default: 1 })
  late_penalty_per_minute: number
}

export const SalaryRuleSchema = SchemaFactory.createForClass(SalaryRule)
