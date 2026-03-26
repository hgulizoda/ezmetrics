import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

import { UserRole } from '../common/enums/user-role.enum'
import { COLLECTION_TIMESTAMPS } from '../constants'

export type UserDocument = HydratedDocument<User>

@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password_hash: string

  @Prop({ required: true })
  name: string

  @Prop({ type: String, enum: UserRole, default: UserRole.MANAGER })
  role: UserRole

  @Prop({ default: true })
  is_active: boolean

  @Prop()
  deleted_at?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
