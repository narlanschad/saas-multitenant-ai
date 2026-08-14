import { Schema, model, Types, type InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

// companyId leads every compound index: all product queries are tenant-scoped first.
productSchema.index({ companyId: 1, category: 1 });
productSchema.index({ companyId: 1, name: 1 });

export type Product = InferSchemaType<typeof productSchema> & { _id: Types.ObjectId };
export const ProductModel = model('Product', productSchema);
