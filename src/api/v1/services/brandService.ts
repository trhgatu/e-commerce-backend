import BrandModel, { IBrand } from '../models/brandModel';
import { paginate } from '../utils/pagination';

export const getBrands = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  return paginate<IBrand>(
    BrandModel,
    { page, limit },
    filters,
    sort,
    'name slug description logo'
  );
};

export const getBrandById = async (id: string): Promise<IBrand | null> => {
  return BrandModel.findById(id).lean();
};

export const createBrand = async (data: Partial<IBrand>): Promise<IBrand> => {
  const brand = new BrandModel(data);
  return brand.save();
};

export const updateBrand = async (
  id: string,
  data: Partial<IBrand>
): Promise<IBrand | null> => {
  return BrandModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteBrand = async (id: string): Promise<IBrand | null> => {
  return BrandModel.findByIdAndDelete(id).lean();
};
