import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

import { COLLECTION_TIMESTAMPS } from '../constants'

export type SystemSettingsDocument = HydratedDocument<SystemSettings>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'system_settings',
})
export class SystemSettings {
  @Prop({ required: true, unique: true })
  key: string

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: any

  @Prop()
  description?: string
}

export const SystemSettingsSchema = SchemaFactory.createForClass(SystemSettings)
