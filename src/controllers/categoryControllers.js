import { Category } from "../models/Category.js";
import categoryServices from "../services/categoryServices.js";
import categoryValidators from "../validations/categoryValidators.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const allCategories = await categoryServices.getAllCategories();
    res.status(200).send(allCategories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryByName = async (req, res, next) => {
  const { name } = req.params;

  try {
    const category = await categoryServices.getAllCategories();
    res
      .status(200)
      .send(
        allCategories.filter((e) =>
          e.name.toLowerCase().includes(name.toLowerCase())
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await categoryServices.getCategoryById(id);
    if (category) {
      res.status(200).send(category);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  const { body } = req;
  const id = await categoryServices.getCategoryLastId();
  try {
    const newCategory = {
      id: ++id.dataValues.id,
      name: body.name,
    };

    const errors = categoryValidators.categoryNameValidator(newCategory);
    if (errors.length > 0) {
      res.status(404).send({ errors });
      return;
    }

    const createdCategory = await categoryServices.createCategory(newCategory);
    if (createdCategory) {
      res.status(200).send("Category created");
    } else {
      res.status(404).send("Error at creating category");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryServices.getCategoryById(id);
    if (!category) {
      res.status(404).send("Category not found, please check");
    } else {
      const hasProducts = await categoryServices.hasRelatedProducts(id);
      if (hasProducts) {
        res.status(400).send("Can't delete a category with related products");
      } else {
        const categoryDeleted = await categoryServices.deleteCategory(id);
        res.status(200).send("Category deleted");
      }
    }
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await categoryValidators.updateValidator(id, body);

    const update = await categoryServices.updateCategory(body, id);
    res.status(200).send("Category updated");
  } catch (error) {
    next(error);
  }
};
