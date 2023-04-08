import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "User.js";
import Product from "Product.js";

export const Order = sequelize.define("order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "cancelled", "paid"),
    allowNull: false,
    defaultValue: "pending",
  },
  shippingCost: {
    type: DataTypes.STRING,
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingZip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingProvince: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.REAL,
  },
});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: "OrderProduct" });
Product.belongsToMany(Order, { through: "OrderProduct" });

export default Order;
