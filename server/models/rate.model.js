import mongoose from "mongoose";

const rateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    validity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Validity",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rate", rateSchema);
