// models/Permission.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum PermissionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
}

export interface IPermission extends Document {
  name: string;
  label: string;
  group: string;
  description?: string;
  status: PermissionStatus;
  isDeleted?: boolean;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    group: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(PermissionStatus),
      default: PermissionStatus.ACTIVE,
      required: true,
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Permission = mongoose.model<IPermission>('Permission', permissionSchema, 'permissions');
export default Permission;
