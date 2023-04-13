import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import User from "./User.js";
import Product from "./Product.js";

export const Order = sequelize.define("Order", {
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
  },
  shippingZip: {
    type: DataTypes.STRING,
  },
  shippingCity: {
    type: DataTypes.STRING,
  },
  shippingProvince: {
    type: DataTypes.STRING,
  },
  total: {
    type: DataTypes.REAL,
  },
});

//Relations

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: "OrderProduct" });
Product.belongsToMany(Order, { through: "OrderProduct" });

export default Order;
