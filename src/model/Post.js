import { Sequelize,DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import User from "./User.js";

const Post = sequelize.define("posts", {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
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
    defaultValue: Sequelize.NOW,
  },
  image: {
    type: DataTypes.STRING(255),
  },
},{
    timestamps:true
});

Post.belongsTo(User);

export default Post
