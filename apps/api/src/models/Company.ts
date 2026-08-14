import { Schema, model, type InferSchemaType } from 'mongoose';

const companySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export type Company = InferSchemaType<typeof companySchema>;
export const CompanyModel = model('Company', companySchema);
