import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

import { BonusRuleType } from '../common/enums/bonus-rule-type.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type BonusRuleDocument = HydratedDocument<BonusRule>

export class BonusTier {
  min_efficiency: number
  max_efficiency?: number
  multiplier?: number
  fixed_amount?: number
}

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'bonus_rules',
})
export class BonusRule {
  @Prop({ required: true })
  name: string

  @Prop({ type: String, enum: BonusRuleType, required: true })
  type: BonusRuleType

  @Prop({ type: [Object], default: [] })
  tiers: BonusTier[]

  @Prop({ default: true })
  is_active: boolean

  @Prop()
  deleted_at?: Date
}

export const BonusRuleSchema = SchemaFactory.createForClass(BonusRule)
