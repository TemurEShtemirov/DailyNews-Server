// Import necessary modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";

// Import User model
import User from "../model/User.js";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Function to register a new user
export const registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { fullname, username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    // Send registration email
    const transporter = nodemailer.createTransport({
      // Configure transporter
    });

    await transporter.sendMail({
      to: email,
      subject: "Registration Successful",
      html: `<p>Dear ${fullname},</p>
             <p>Welcome to our platform! You have successfully registered.</p>`,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to login a user
export const loginUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If user not found or password doesn't match, respond with error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send login email
    const transporter = nodemailer.createTransport({
      // Configure transporter
    });

    await transporter.sendMail({
      to: email,
      subject: "Login Successful",
      html: `<p>Dear ${user.fullname},</p>
             <p>Your login to our platform was successful.</p>`,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from database
    const users = await User.findAll();

    // Respond with users data
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get a user by id
export const getUserById = async (req, res) => {
  try {
    // Extract user id from request parameters
    const { id } = req.params;

    // Find user by id
    const user = await User.findByPk(id);

    // If user not found, respond with error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a user by id
export const deleteUserById = async (req, res) => {
  try {
    // Extract user id from request parameters
    const { id } = req.params;

    // Find user by id and delete
    const deletedUser = await User.destroy({ where: { id } });

    // If no user was deleted, respond with error
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a user by id
export const updateUserById = async (req, res) => {
  try {
    // Extract user id from request parameters
    const { id } = req.params;

    // Extract updated user data from request body
    const { fullname, username, email } = req.body;

    // Find user by id and update
    const [updatedRows] = await User.update(
      { fullname, username, email },
      { where: { id } }
    );

    // If no rows were updated, respond with error
    if (!updatedRows) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
