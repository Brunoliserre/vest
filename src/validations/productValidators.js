import Product from "../models/Product.js";

const nameValidator = async (category) => {
  const errors = [];
  const { name } = category;
  const existingProduct = await Product.findOne({
    where: { name },
  });

  if (name.length < 3 || name.length > 20) {
    errors.push("Product name should have between 3 and 20 characters");
  }

  if (existingProduct && existingProduct.id !== id) {
    errors.push("Product already exist");
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
    const existingProduct = await Product.findOne({
      where: { name: updateData.name },
    });

    if (existingProduct && existingProduct.id !== id) {
      errors.push("Product name already exist");
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
};

const productValidators = {
  nameValidator,
  updateValidator,
};

export default productValidators;
