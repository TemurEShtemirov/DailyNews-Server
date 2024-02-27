// Import necessary modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import schedule from "schedule";

// Import User model
import User from "../model/User.js";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./user_upload/"); // Fix the destination path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "temureshtemirov10@gmail.com",
    pass: "edlxigeiubffzdms",
  },
});

// Function to register a new user
export const registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { fullname, username, email, password } = req.body;

    // Handle file upload
    upload.single("file")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "File upload error" });
      } else if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user record
      const user = await User.create({
        fullname,
        username,
        email,
        password: hashedPassword,
        profilePicture: req.file ? req.file.filename : null, // Save filename in the database
      });

      // Send email using nodemailer
      await sendEmail(name, email, newOrder.id);

      // Schedule the follow-up email after 4 hours
      scheduleFollowUpEmail(newOrder.id, name, email);

      // // Send registration email
      // const transporter = nodemailer.createTransport({
      //   // Configure transporter
      // });

      // await transporter.sendMail({
      //   to: email,
      //   subject: "Registration Successful",
      //   html: `<p>Dear ${fullname},</p>
      //        <p>Welcome to our platform! You have successfully registered.</p>`,
      // });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, "daily__blog", {
        expiresIn: "1h",
      });

      // Respond with success message and token
      res.status(201).json({ message: "User registered successfully", token });
    });
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
    const token = jwt.sign({ userId: user.id }, "daily__blog", {
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
    const { fullname, username, email, password } = req.body;

    // Find user by id and update
    const [updatedRows] = await User.update(
      { fullname, username, email, password },
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



const sendEmail = async (fullname, email) => {
  // HTML email content
  const htmlMessage = `
   <p>Dear ${fullname},</p>
         <p>Welcome to our platform! You have successfully registered.</p>
  `;

  // Email options
  const mailOptions = {
    from: "temureshtemirov10@gmail.com",
    to: email,
    subject: "Register Confirmation",
    html: htmlMessage,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const scheduleFollowUpEmail = (orderId, name, email) => {
  const followUpDate = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours later

  const job = schedule.scheduleJob(followUpDate, async () => {
    try {
      // Fetch the order details from the database
      const order = await OrderModel.findByPk(orderId);

      if (order && !order.isFinished) {
        // Send follow-up email using nodemailer
        await sendFollowUpEmail(name, email);

        // Update the order status to indicate it is finished
        await updateOrderStatus(orderId);
      }
    } catch (error) {
      console.error("Error scheduling follow-up email:", error);
    }
  });

  console.log(`Follow-up email scheduled for ${followUpDate}`);
};

const updateOrderStatus = async (orderId) => {
  // Update the order status in the database
  await OrderModel.update({ isFinished: true }, { where: { id: orderId } });
};

const sendFollowUpEmail = async (fullname, email) => {
  // Update the subject and content for the follow-up email
  const followUpMailOptions = {
    from: "temureshtemirov10@gmail.com",
    to: email,
    subject: "Registration Successful",
    html: `<p>Dear ${fullname},</p>
         <p>Welcome to our platform! You have successfully registered.</p>`,
  };

  // Send follow-up email
  try {
    await transporter.sendMail(followUpMailOptions);
    console.log("Follow-up email sent successfully");
  } catch (error) {
    console.error("Error sending follow-up email:", error);
  }
};
