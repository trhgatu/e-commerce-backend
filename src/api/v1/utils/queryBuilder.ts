import { Request } from 'express';

export interface QueryFilters {
  filters: Record<string, any>;
  sort: Record<string, 1 | -1>;
}

export const buildProductQuery = (req: Request): QueryFilters => {
  const search = (req.query.search as string) || '';
  const category = req.query.category as string;
  const brand = req.query.brand as string;
  const priceMin = req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined;
  const priceMax = req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const filters: any = {};

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    filters.categoryId = category;
  }

  if (brand) {
    filters.brand = brand;
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    filters.price = {};
    if (priceMin !== undefined) filters.price.$gte = priceMin;
    if (priceMax !== undefined) filters.price.$lte = priceMax;
  }

  const sort: Record<string, 1 | -1> = { [sortBy]: order };

  return { filters, sort };
};
