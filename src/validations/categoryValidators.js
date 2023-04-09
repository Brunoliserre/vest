import Category from "../models/Category.js";

const categoryNameValidator = async (category) => {
  const errors = [];
  const { name } = category;
  const existingCategory = await Category.findOne({
    where: { name },
  });

  if (name.length < 3 || name.length > 20) {
    error.push("Category name should have between 3 and 50 characters.");
  }

  if (existingCategory) {
    error.push("Category name already exist");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
};

const updateValidator = async (id, updateData) => {
  const errors = [];

  if (!updateData || Object.keys(updateData).length === 0) {
    errors.push("No update data provided");
  }

  if (updateData.name) {
    const existingCategory = await Category.findOne({
      where: { name: updateData.name },
    });

    if (existingCategory && existingCategory.id !== id) {
      errors.push("Category name already exist");
    }
  }

  if (errors.length > 0) {
    throw new Error(erros.join(" "));
  }
};

const categoryValidators = {
  categoryNameValidator,
  updateValidator,
};

export default categoryValidators;
