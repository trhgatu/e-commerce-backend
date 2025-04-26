import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const wishlistSchema: Schema<IWishlist> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IWishlist>('Wishlist', wishlistSchema, 'wishlists');