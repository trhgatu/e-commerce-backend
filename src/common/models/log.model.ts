import mongoose, { Schema, Document } from 'mongoose';

export enum LogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  RESTORE = 'restore',
  LOGIN = 'login',
  REGISTER = 'register',
  UPDATE_PROFILE = 'update-profile',
  LOGOUT = 'logout',
  CUSTOM = 'custom',
  READ = 'read',
  READ_ALL = 'read-all',
  ASSIGN_PERMISSION = 'assign-permission',
}

export interface ILog extends Document {
  userId: string;
  targetModel: string;
  targetId: mongoose.Types.ObjectId;
  action: LogAction;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    userId: { type: String, ref: 'User', required: true },
    targetModel: { type: String, required: true },
    targetId: { type: Schema.Types.Mixed, required: true },
    action: {
      type: String,
      enum: Object.values(LogAction),
      required: true,
    },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Log = mongoose.model<ILog>('Log', logSchema, 'logs');

export default Log;
