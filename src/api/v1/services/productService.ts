import ProductModel, { IProduct } from '../models/productModel';

// Get all products with pagination
export const getProducts = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const products = await ProductModel.find().skip(skip).limit(limit);
  const total = await ProductModel.countDocuments();
  return { products, total };
};

// Get product by ID
export const getProductById = async (id: string): Promise<IProduct | null> => {
  return ProductModel.findById(id);
};

// Create new product
export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = new ProductModel(data);
  return product.save();
};

// Update product
export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct | null> => {
  return ProductModel.findByIdAndUpdate(id, data, { new: true });
};

// Delete product
export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return ProductModel.findByIdAndDelete(id);
};