import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.config.js";
import User from "./User.js";

const Post = sequelize.define(
  "Posts",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "uuid",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publication_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    image: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "posts",
    timestamps: false,
  }
);


export default Post;
