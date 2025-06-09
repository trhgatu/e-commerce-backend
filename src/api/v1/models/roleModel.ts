import mongoose, { Schema, Document } from "mongoose";

export enum RoleStatus {
    ACTIVE = 'active',
    DEPRECATED = 'deprecated'
}

export interface IRole extends Document {
    name: string;
    description?: string;
    permissions: mongoose.Types.ObjectId[];
    status: RoleStatus;
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
}

const roleSchema = new Schema<IRole>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, default: '' },
        permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
        status: {
            type: String,
            enum: Object.values(RoleStatus),
            default: RoleStatus.ACTIVE,
            required: true,
        },

        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Role = mongoose.model<IRole>('Role', roleSchema, 'roles');
export default Role;