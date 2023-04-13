import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const getAllProducts = async () => {
  const allProducts = await Product.findAll();
  return allProducts;
};

const getProductLastId = async () => {
  try {
    const lastId = await Product.findOne({
      order: [["id", "DESC"]],
    });
    return lastId;
  } catch (error) {
    throw new Error("Error getting last product ID");
  }
};

const getProductById = async (id) => {
  const productById = await Product.findByPk(id);
  return productById;
};

const createProduct = async (newProduct) => {
  const createdProduct = await Product.create(newProduct);
  return createdProduct;
};

const hasRelatedOrders = async (productId) => {
  const count = await Product.count({
    where: { productId },
    include: {
      model: Order,
      through: {
        attributes: [],
      },
    },
  });

  return count > 0;
};

const deleteProduct = async (productId) => {
  const hasProducts = await hasRelatedProducts(categoryId);

  if (hasProducts) {
    throw new Error("Can't delete products with open orders");
  }

  return result === 1;
};

const updateProduct = async (body, id) => {
  const updatedProduct = await Product.update(body, {
    where: {
      id: id,
    },
  });
};

const productServices = {
  getAllProducts,
  getProductLastId,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  hasRelatedOrders,
};

export default productServices;
