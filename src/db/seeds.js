import Category from "../models/Category.js";
import dbCategory from "./dbCategory.js";

const seedCategories = async () => {
  try {
    await Category.bulkCreate(dbCategory);
    console.log("Categories seeded succesfully");
  } catch (error) {
    console.log("Error seeding categories", error);
  }
};

export default seedCategories;
