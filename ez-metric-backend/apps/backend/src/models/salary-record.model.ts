import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

import { SalaryStatus } from '../common/enums/salary-status.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type SalaryRecordDocument = HydratedDocument<SalaryRecord>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'salary_records',
})
export class SalaryRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'workers', required: true })
  worker_id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  period_start: Date

  @Prop({ required: true })
  period_end: Date

  @Prop({ default: 0 })
  base_salary: number

  @Prop({ default: 0 })
  overtime_pay: number

  @Prop({ default: 0 })
  bonus_amount: number

  @Prop({ default: 0 })
  deductions: number

  @Prop({ default: 0 })
  late_penalty: number

  @Prop({ default: 0 })
  loan_deduction: number

  @Prop({ default: 0 })
  total_salary: number

  @Prop({ type: String, enum: SalaryStatus, default: SalaryStatus.DRAFT })
  status: SalaryStatus

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  approved_by?: MongooseSchema.Types.ObjectId

  @Prop()
  override_amount?: number

  @Prop()
  override_note?: string
}

export const SalaryRecordSchema = SchemaFactory.createForClass(SalaryRecord)
