import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import Category from "./Category.js";

export const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Category.belongsToMany(Product, { through: "CategoryProduct" });
Product.belongsToMany(Category, { through: "CategoryProduct" });

export default Product;
