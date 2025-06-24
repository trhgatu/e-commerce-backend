import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  ORDER = 'order',
  SYSTEM = 'system',
  VOUCHER = 'voucher',
  ADMIN = 'admin',
  SHIPPING = 'shipping',
  REVIEW = 'review',
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  isGlobal: boolean;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  readAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isGlobal: { type: Boolean, default: false },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    metadata: { type: Object },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId }
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  'Notification',
  notificationSchema,
  'notifications'
);

export default Notification;
