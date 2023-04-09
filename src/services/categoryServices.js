import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const getAllCategories = async () => {
  const allCategories = await Category.findAll();
  return allCategories;
};

const getCategoryLastId = async () => {
  try {
    const lastId = await Category.findOne({
      order: [["id", "DESC"]],
    });
    return lastId;
  } catch (error) {
    throw new Error("Error getting last category ID");
  }
};

const getCategoryById = async (id) => {
  const categoryById = await Category.findByPk(id);
  return categoryById;
};

const createCategory = async (newCategory) => {
  const createdCategory = await Category.create(newCategory);
  return createdCategory;
};

const hasRelatedProducts = async (categoryId) => {
  const count = await CategoryProduct.count({
    where: { categoryId },
  });

  return count > 0;
};

const deleteCategory = async (categoryId) => {
  const hasProducts = await hasRelatedProducts(categoryId);

  if (hasProducts) {
    throw new Error("Can't delete category with related products");
  }

  return result === 1;
};

const updateCategory = async (body, id) => {
  const updatedCategory = await Category.update(body, {
    where: {
      id: id,
    },
  });
};

const categoryServices = {
  hasRelatedProducts,
  getAllCategories,
  getCategoryById,
  getCategoryLastId,
  deleteCategory,
  createCategory,
  updateCategory,
};

export default categoryServices;
