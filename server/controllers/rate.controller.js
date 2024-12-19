import Rate from "../models/rate.model.js";

// Get all rates
export const getAllRates = async (req, res) => {
  try {
    const rates = await Rate.find()
      .populate("validity")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: rates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving rates",
      error: error.message,
    });
  }
};

// Create rate
export const createRate = async (req, res) => {
  try {
    const { name, amount, validity } = req.body;

    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!validity) {
      return res.status(400).json({
        success: false,
        message: "Validity is required",
      });
    }

    // Check if rate with same name exists
    const existingRate = await Rate.findOne({ name });
    if (existingRate) {
      return res.status(400).json({
        success: false,
        message: "Rate with this name already exists",
      });
    }

    const newRate = await Rate.create({
      name,
      amount,
      validity,
    });

    const populatedRate = await newRate.populate("validity");

    res.status(201).json({
      success: true,
      data: populatedRate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating rate",
      error: error.message,
    });
  }
};

// Update rate
export const updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, validity } = req.body;

    // Check if rate exists
    const rate = await Rate.findById(id);
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "Rate not found",
      });
    }

    // Check if another rate with same name exists
    const existingRate = await Rate.findOne({
      name,
      _id: { $ne: id },
    });
    if (existingRate) {
      return res.status(400).json({
        success: false,
        message: "Rate with this name already exists",
      });
    }

    rate.name = name;
    rate.amount = amount;
    rate.validity = validity;

    await rate.save();
    const updatedRate = await rate.populate("validity");

    res.status(200).json({
      success: true,
      data: updatedRate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating rate",
      error: error.message,
    });
  }
};

// Delete rate
export const deleteRate = async (req, res) => {
  try {
    const { id } = req.params;

    const rate = await Rate.findById(id);
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "Rate not found",
      });
    }

    await Rate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Rate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting rate",
      error: error.message,
    });
  }
};
