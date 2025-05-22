import { Request } from "express";

export interface CommonQuery {
  filters: Record<string, any>;
  sort: Record<string, 1 | -1>;
}
export const buildCommonQuery = (
  req: Request,
  searchableFields: string[] = ["name"]
): CommonQuery => {
  const filters: Record<string, any> = {};

  const isDeleted = req.query.isDeleted;
  if (typeof isDeleted === "string") {
    filters.isDeleted = isDeleted === "true";
  }

  const search = (req.query.search as string) || "";
  if (search && searchableFields.length) {
    filters.$or = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  const sortBy = (req.query.sortBy as string) || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortBy]: order };

  return { filters, sort };
};
