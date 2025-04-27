import ProductModel, { IProduct } from '../models/productModel';
import { paginate } from '../utils/pagination';

// Get all products with pagination
export const getProducts = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  return paginate<IProduct>(
    ProductModel,
    { page, limit },
    filters,
    sort,
    'name price images thumbnail description'
  );
};

// Get product by ID
export const getProductById = async (id: string): Promise<IProduct | null> => {
  return ProductModel.findById(id).lean();
};

// Create new product
export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = new ProductModel(data);
  return product.save();
};

// Update product
export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct | null> => {
  return ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

// Delete product
export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return ProductModel.findByIdAndDelete(id).lean();
};