import { Express } from 'express';
import productRoutes from '@modules/product/product.route'
import authRoutes from '@modules/auth/auth.route';
import userRoutes from '@modules/user/user.route';
import categoryRoutes from '@modules/category/category.route';
import brandRoutes from '@modules/brand/brand.route';
import colorRoutes from '@modules/color/color.route';
import cartRoutes from '@modules/cart/cart.route';
import orderRoutes from '@modules/order/order.route';
import imageRoutes from '@modules/upload-image/upload-image.route'
import roleRoutes from '@modules/role/role.route'
import permissionRoutes from '@modules/permission/permission.route';
import inventoryRoutes from '@modules/inventory/inventory.route'
import voucherRoutes from '@modules/voucher/voucher.route'
import logRoutes from '@modules/log/log.route'
import addressRoutes from '@modules/address/address.route'
import paymentRoutes from '@modules/payment/routes/payment.route'

const router = (app: Express) => {
    const version = '/api/v1';
    app.use(version + '/products', productRoutes);
    app.use(version + '/auth', authRoutes);
    app.use(version + '/users', userRoutes);
    app.use(version + '/categories', categoryRoutes);
    app.use(version + '/brands', brandRoutes)
    app.use(version + '/colors', colorRoutes)
    app.use(version + '/carts', cartRoutes)
    app.use(version + '/orders', orderRoutes)
    app.use(version + '/images', imageRoutes)
    app.use(version + '/roles', roleRoutes)
    app.use(version + '/permissions', permissionRoutes);
    app.use(version + '/inventories', inventoryRoutes);
    app.use(version + '/vouchers', voucherRoutes);
    app.use(version + '/logs', logRoutes);
    app.use(version + '/addresses', addressRoutes);
    app.use(version + '/payments', paymentRoutes);
};

export default router;