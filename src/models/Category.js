import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import Product from "./Product.js";

export const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Category.belongsToMany(Product, { through: "CategoryProduct" });
Product.belongsToMany(Category, { through: "CategoryProduct" });

export default Category;
