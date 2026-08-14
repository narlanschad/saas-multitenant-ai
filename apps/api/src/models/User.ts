import { Schema, model, Types, type InferSchemaType } from 'mongoose';

export const USER_ROLES = ['admin', 'user'] as const;
export type UserRole = (typeof USER_ROLES)[number];

const userSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, required: true },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export const UserModel = model('User', userSchema);
