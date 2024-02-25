import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User.js";

class Post extends Model {}

Post.init(
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
      defaultValue: DataTypes.NOW,
    },
    image: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: false,
  }
);

export default Post;
