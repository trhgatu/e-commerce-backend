import { Model } from 'mongoose';

type Query = Record<string, any>;
type Sort = Record<string, 1 | -1>;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}


export const paginate = async <T>(
    model: Model<T>,
    { page = 1, limit = 10 }: PaginationParams,
    query: Query = {},
    sort: Sort = {},
    select = ''
  ): Promise<PaginationResult<T>> => {
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        model.find(query)
          .select(select)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean<T[]>(),
        model.countDocuments(query),
      ]);

      return {
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Pagination failed: ${(error as Error).message}`);
    }
  };
