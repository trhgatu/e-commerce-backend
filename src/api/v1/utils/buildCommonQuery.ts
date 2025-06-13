import { Request } from "express";

export interface CommonQuery {
  filters: Record<string, any>;
  sort: Record<string, 1 | -1>;
  keyword?: string;
}

export const buildCommonQuery = (
  req: Request,
  searchableFields: string[] = ["name"]
): CommonQuery => {
  const filters: Record<string, any> = {};

  // Filter isDeleted (true/false)
  const isDeleted = req.query.isDeleted;
  if (typeof isDeleted === "string") {
    filters.isDeleted = isDeleted === "true";
  }

  const status = req.query.status;
  if (typeof status === "string") {
    filters.status = status;
  }

  // Unified keyword search
  const keyword = (req.query.search as string) || "";

  if (keyword && searchableFields.length) {
    filters.$or = searchableFields.map((field) => ({
      [field]: { $regex: keyword, $options: "i" },
    }));
  }
  //Group - for Permission
  const group = req.query.group;
  if (typeof group === "string") {
    filters.group = group;
  }

  // Sorting
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortBy]: order };

  return { filters, sort, keyword };
};
