import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

import { LoanType } from '../common/enums/loan-type.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type LoanDocument = HydratedDocument<Loan>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'loans',
})
export class Loan {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'workers', required: true })
  worker_id: MongooseSchema.Types.ObjectId

  @Prop({ type: String, enum: LoanType, required: true })
  type: LoanType

  @Prop({ required: true })
  amount: number

  @Prop({ default: 0 })
  remaining_balance: number

  @Prop({ default: 0 })
  deduction_per_period: number

  @Prop()
  note?: string

  @Prop({ default: true })
  is_active: boolean
}

export const LoanSchema = SchemaFactory.createForClass(Loan)
