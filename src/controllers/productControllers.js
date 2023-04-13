import { Product } from "../models/Product.js";
import productServices from "../services/productServices.js";
import productValidators from "../validations/productValidators.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await productServices.getAllProducts();
    res.status(200).send(allProducts);
  } catch (error) {
    next(error);
  }
};

export const getProductByName = async (req, res, next) => {
  const { name } = req.query;

  try {
    const allProducts = await productServices.getAllProducts();
    const filteredProducts = allProducts.filter((e) =>
      e.name.toLowerCase().includes(name.toLowerCase())
    );
    res.status(200).send(filteredProducts);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await productServices.getProductById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const { body } = req;
  const id = await productServices.getProductLastId();
  try {
    const newProduct = {
      id: ++id.dataValues.id,
      name: body.name,
      description: body.description,
      price: body.price,
      rating: body.rating,
      stock: body.stock,
      thumbnail: body.thumbnail,
      images: body.images,
      active: body.active,
    };

    const errors = productValidators.nameValidator(newProduct);
    if (errors.length > 0) {
      res.status(404).send({ errors });
      return;
    }

    const createdProduct = await productServices.createProduct(newProduct);
    if (createdProduct) {
      res.status(200).send("Product created");
    } else {
      res.status(404).send("Error at creating product");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await productServices.getProductById(id);
    if (!product) {
      res.status(404).send("Product not found, please check");
    } else {
      const hasOrders = await productServices.hasRelatedOrders(id);
      if (hasOrders) {
        res.status(400).send("Can't delete a product with an open order");
      } else {
        const productDeleted = await productServices.deleteProduct(id);
        if (productDeleted) {
          res.status(200).send("Product deleted");
        } else {
          res.status(404).send("Error deleting product");
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await productValidators.updateValidator(id, body);

    const update = await categoryServices.updateCategory(body, id);
    res.status(200).send("Category updated");
  } catch (error) {
    next(error);
  }
};
