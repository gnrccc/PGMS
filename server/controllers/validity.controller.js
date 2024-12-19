import Validity from "../models/rate.validity.model.js";
import Rate from "../models/rate.model.js";

// Get all validities
export const getAllValidities = async (req, res) => {
  try {
    const validities = await Validity.find().sort({ months: 1, days: 1 });
    res.status(200).json({
      success: true,
      data: validities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving validities",
      error: error.message,
    });
  }
};

// Create validity
export const createValidity = async (req, res) => {
  try {
    const { days, months } = req.body;

    // Check if validity with same duration exists
    const existingValidity = await Validity.findOne({ days, months });
    if (existingValidity) {
      return res.status(400).json({
        success: false,
        message: "Validity with this duration already exists",
      });
    }

    const newValidity = await Validity.create({
      days: days || 0,
      months: months || 0,
    });

    res.status(201).json({
      success: true,
      data: newValidity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating validity",
      error: error.message,
    });
  }
};

// Update validity
export const updateValidity = async (req, res) => {
  try {
    const { id } = req.params;
    const { days, months } = req.body;

    // Check if validity exists
    const validity = await Validity.findById(id);
    if (!validity) {
      return res.status(404).json({
        success: false,
        message: "Validity not found",
      });
    }

    // Check if another validity with same duration exists
    const existingValidity = await Validity.findOne({
      days,
      months,
      _id: { $ne: id },
    });
    if (existingValidity) {
      return res.status(400).json({
        success: false,
        message: "Validity with this duration already exists",
      });
    }

    validity.days = days || 0;
    validity.months = months || 0;

    await validity.save(); // This will trigger the pre-save middleware

    res.status(200).json({
      success: true,
      data: validity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating validity",
      error: error.message,
    });
  }
};

// Delete validity
export const deleteValidity = async (req, res) => {
  try {
    const { id } = req.params;

    const validity = await Validity.findById(id);
    if (!validity) {
      return res.status(404).json({
        success: false,
        message: "Validity not found",
      });
    }

    // Check if validity is being used by any rates
    const existingRates = await Rate.find({ validity: id });
    if (existingRates.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete validity as it is being used by existing rates",
      });
    }

    await Validity.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Validity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting validity",
      error: error.message,
    });
  }
};
