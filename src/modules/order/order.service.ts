import mongoose from 'mongoose';
import { OrderModel, IOrder, OrderStatus, PaymentStatus } from './models';
import { IProduct } from '@modules/product/product.model';
import {
    getCache,
    setCache,
    deleteKeysByPattern
} from '@shared/services/redis.service';
import {
    mergeDuplicateItems,
    paginate
} from '@common/utils';
import {
    validateVoucherUsage,
    increaseVoucherUsage
} from '@modules/voucher/voucher.service';
import { CreateOrderInput } from './dtos/order-input.dto';
import InventoryModel from '@modules/inventory/inventory.model'
import { createAndEmitNotification } from '@modules/notification/notification.service';
import { NotificationType } from '@modules/notification/notification.model';

export const getAllOrders = async (
    page: number,
    limit: number,
    filters: Record<string, unknown> = {},
    sort: Record<string, 1 | -1> = {}
) => {
    const finalFilters: Record<string, unknown> = {
        isDeleted: false,
        ...filters,
    };

    const cacheKey = `orders:page=${page}:limit=${limit}:filters=${JSON.stringify(
        finalFilters
    )}:sort=${JSON.stringify(sort)}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const result = await paginate<IOrder>(
        OrderModel,
        { page, limit },
        finalFilters,
        sort,
        [
            { path: 'userId', select: 'fullName email' },
            { path: 'colorId', select: 'name hexCode' },
            { path: 'items.productId', select: 'name price' },
            { path: 'voucherId', select: 'code value' },
        ]
    );

    await setCache(cacheKey, result);
    return result;
};

export const createOrder = async (
    data: CreateOrderInput,
    userId: string
): Promise<IOrder> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, voucherCode } = data;

        if (!items || items.length === 0) {
            throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
        }

        const mergedItems = mergeDuplicateItems(items);
        if (items.length !== mergedItems.length) {
            console.log(`[OrderService] Merged duplicate items: ${items.length} → ${mergedItems.length}`);
        }

        let calculatedTotal = 0;

        for (const item of mergedItems) {
            const inventory = await InventoryModel.findById(item.inventoryId)
                .populate<{ productId: IProduct }>({
                    path: 'productId',
                    match: { isDeleted: false },
                })
                .session(session);

            if (!inventory || !inventory.productId || inventory.quantity < item.quantity) {
                throw new Error(`Sản phẩm không tồn tại hoặc không đủ tồn kho.`);
            }

            const product = inventory.productId;
            const productPrice = product.price;

            item.price = productPrice;
            calculatedTotal += productPrice * item.quantity;

            inventory.quantity -= item.quantity;
            await inventory.save({ session });
        }

        data.items = mergedItems;
        if (voucherCode) {
            const { discount, finalTotal, voucher } = await validateVoucherUsage(
                voucherCode,
                userId,
                calculatedTotal || 0
            );
            data.voucherId = voucher._id;
            data.discount = discount;
            data.finalTotal = finalTotal;
        } else {
            data.discount = 0;
            data.finalTotal = calculatedTotal;
        }

        data.userId = userId;
        data.createdBy = userId;

        const order = new OrderModel({
            ...data,
            txnRef: new mongoose.Types.ObjectId().toString()
        });
        const saved = await order.save({ session });

        await createAndEmitNotification(userId, {
            title: 'Đặt hàng thành công.',
            content: `Đơn hàng #${saved.txnRef} đã được tạo thành công.`,
            type: NotificationType.ORDER,
            metadata: { orderId: saved._id },
        });

        if (voucherCode && data.voucherId) {
            await increaseVoucherUsage(data.voucherId.toString(), userId);
        }

        await session.commitTransaction();
        session.endSession();

        await deleteKeysByPattern('orders:*');

        return saved;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


export const getOrderById = async (id: string): Promise<IOrder | null> => {
    return await OrderModel.findById(id)
        .populate('userId', 'fullName email')
        .populate('items.productId', 'name price')
        .populate('voucherId', 'code')
        .lean();
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
    return await OrderModel.find({ userId })
        .sort({ createdAt: -1 })
        .lean();
};

export const updateOrderStatus = async (
    id: string,
    status: OrderStatus,
    userId: string
): Promise<IOrder | null> => {
    const updated = await OrderModel.findByIdAndUpdate(
        id,
        { status, updatedBy: userId },
        { new: true }
    ).lean();

    await deleteKeysByPattern('orders:*');
    return updated;
};

export const updatePaymentStatus = async (
    id: string,
    paymentStatus: PaymentStatus,
    userId: string
): Promise<IOrder | null> => {
    const updated = await OrderModel.findOneAndUpdate(
        { txnRef: id },
        { paymentStatus, updatedBy: userId },
        { new: true }
    ).lean();

    if (!updated) throw new Error('Order not found');

    await deleteKeysByPattern('orders:*');
    return updated;
};

export const cancelOrder = async (id: string): Promise<IOrder | null> => {
    const order = await OrderModel.findById(id);
    if (!order || order.status === OrderStatus.CANCELLED) return null;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const item of order.items) {
            await InventoryModel.findByIdAndUpdate(
                item.inventoryId,
                { $inc: { quantity: item.quantity } },
                { session }
            );
        }

        order.status = OrderStatus.CANCELLED;
        const saved = await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        await deleteKeysByPattern('orders:*');
        return saved;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
