import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { isValidAge } from "../utils/age.validation.js";
import { isValidPhoneNumber } from "../utils/phone.validation.js";

// Update user
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    gender,
    birthDate,
    address,
    phoneNumber,
    userName,
    password,
  } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate age (18-55 years old)
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

    // Validate username if provided
    if (userName) {
      if (!/^[a-zA-Z0-9]{8,16}$/.test(userName)) {
        return res.status(400).json({
          message:
            "Username must be 8-16 characters long and contain only letters and numbers",
        });
      }

      // Check if new username already exists for a different user
      const userWithUsername = await User.findOne({
        userName,
        _id: { $ne: id },
      });
      if (userWithUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Validate password if provided
    let hashedPassword;
    if (password) {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,24}$)/.test(password)
      ) {
        return res.status(400).json({
          message:
            "Password must be 8-24 characters long and contain at least one lowercase letter, one uppercase letter, and one special character",
        });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Build update object with only provided fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (gender) updateData.gender = gender;
    if (birthDate) updateData.birthDate = birthDate;
    if (address) updateData.address = address;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (userName) updateData.userName = userName;
    if (hashedPassword) updateData.password = hashedPassword;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: `${updatedUser.firstName} ${updatedUser.lastName} updated successfully`,
      user: {
        userName: updatedUser.userName,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};
