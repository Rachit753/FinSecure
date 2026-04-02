import Record from "../models/Record.js";

export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({
        message: "Amount, type and category are required",
      });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      notes,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Record created successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};