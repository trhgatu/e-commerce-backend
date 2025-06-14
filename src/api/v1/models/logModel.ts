import mongoose, { Schema, Document } from 'mongoose';

export enum LogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  RESTORE = 'restore',
  LOGIN = 'login',
  LOGOUT = 'logout',
  CUSTOM = 'custom',
}

export interface ILog extends Document {
  userId: mongoose.Types.ObjectId;
  targetModel: string;
  targetId: mongoose.Types.ObjectId;
  action: LogAction;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetModel: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
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
