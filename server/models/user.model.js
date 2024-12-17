import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userName: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "staff", "customer", "member", "trainer"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
