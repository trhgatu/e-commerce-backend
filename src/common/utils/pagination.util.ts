import { Model, PopulateOptions } from 'mongoose';

type Query = Record<string, unknown>;
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
  populate?: string | string[] | PopulateOptions[],
  select = ''
): Promise<PaginationResult<T>> => {
  const skip = (page - 1) * limit;

  try {
    let dbQuery = model.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((p: PopulateOptions | string) => {
          if (typeof p === 'string') {
            dbQuery = dbQuery.populate({ path: p });
          } else {
            dbQuery = dbQuery.populate(p);
          }
        });
      } else {
        dbQuery = typeof populate === 'string'
          ? dbQuery.populate({ path: populate })
          : dbQuery.populate(populate as PopulateOptions);
      }
    }

    const [data, total] = await Promise.all([
      dbQuery.lean<T[]>(),
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
