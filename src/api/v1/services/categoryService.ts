import CategoryModel, { ICategory } from '../models/categoryModel';
import { paginate } from '../utils/pagination';

export const getCategories = async (
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1> = {}
) => {
    return paginate<ICategory>(
        CategoryModel,
        { page, limit },
        filters,
        sort,
        'name parentId description icon'
    );
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
    return CategoryModel.findById(id).lean();
};

export const createCategory = async (data: Partial<ICategory>): Promise<ICategory> => {
    const category = new CategoryModel(data);
    return category.save();
};

export const updateCategory = async (
    id: string,
    data: Partial<ICategory>
): Promise<ICategory | null> => {
    return CategoryModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
    return CategoryModel.findByIdAndDelete(id).lean();
};

export const getCategoryTree = async (): Promise<any[]> => {
    const categories = await CategoryModel.find({ parentId: null }).populate({
      path: 'children',
      model: 'Category',
      populate: {
        path: 'children',
        model: 'Category'
      }
    }).lean();

    return categories;
  };
