import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

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

export default Category;
