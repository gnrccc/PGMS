import mongoose from "mongoose";

const validitySchema = new mongoose.Schema(
  {
    days: {
      type: Number,
    },
    months: {
      type: Number,
    },
    validity: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to format validity string
validitySchema.pre("save", function (next) {
  let validityString = "";

  if (this.months > 0) {
    validityString += `${this.months} ${
      this.months === 1 ? "Month" : "Months"
    }`;
    if (this.days > 0) {
      validityString += ` ${this.days} ${this.days === 1 ? "Day" : "Days"}`;
    }
  } else {
    if (this.days > 0) {
      validityString = `${this.days} ${this.days === 1 ? "Day" : "Days"}`;
    } else {
      validityString = "0 Days";
    }
  }

  this.validity = validityString;
  next();
});

export default mongoose.model("Validity", validitySchema);
