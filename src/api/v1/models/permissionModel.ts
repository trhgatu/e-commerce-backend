// models/Permission.ts
import mongoose, { Schema, Document } from 'mongoose';
import { boolean } from 'zod';

export interface IPermission extends Document {
  name: string;
  label: string;
  group: string;
  description?: string;
  isDeleted?: boolean;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    group: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Permission = mongoose.model<IPermission>('Permission', permissionSchema, 'permissions');
export default Permission;
