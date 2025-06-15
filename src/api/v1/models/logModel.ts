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
  userId: mongoose.Types.ObjectId;        // Ai thao tác
  targetModel: string;                    // Tên collection bị thao tác (vd: Product)
  targetId: mongoose.Types.ObjectId;      // Id bản ghi bị thao tác
  action: LogAction;                      // Loại hành động
  description?: string;                   // Ghi chú chi tiết
  metadata?: Record<string, any>;         // Tuỳ biến thêm info (VD: old/new value, IP...)
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
