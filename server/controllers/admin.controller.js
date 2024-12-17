import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { isValidAge } from "../utils/age.validation.js";
import { isValidPhoneNumber } from "../utils/phone.validation.js";

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" })
      .select("-password") // Exclude sensitive data
      .sort({ lastName: 1, firstName: 1 }); // Sort by name

    // Check if any staff exists
    if (!staff || staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No staff members found",
      });
    }

    // Return success response with staff data
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: "Error retrieving staff members",
      error: error.message,
    });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      address,
      phoneNumber,
      userName,
      password,
      role,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !birthDate ||
      !address ||
      !phoneNumber ||
      !userName ||
      !password ||
      !role
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    if (!isValidAge(birthDate)) {
      return res.status(400).json({
        message: "Age must be between 18 to 55 years old",
      });
    }

    // Validate phone number philippines format 09123456789
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        message: "Phone number must start with 09 followed by 9 digits",
      });
    }

    // Check if phone number already exists
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Validate username is alphanumeric and correct length
    if (!/^[a-zA-Z0-9]{8,16}$/.test(userName)) {
      return res.status(400).json({
        message:
          "Username must be 8-16 characters long and contain only letters and numbers",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Validate password strength
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,24}$)/.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-24 characters long and contain at least one lowercase letter, one uppercase letter, and one special character",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      gender,
      birthDate,
      address,
      phoneNumber,
      userName,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: `${newUser.firstName} ${newUser.lastName} created successfully`,
      user: {
        userName: newUser.userName,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id exists
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: `${user.firstName} ${user.lastName} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};
