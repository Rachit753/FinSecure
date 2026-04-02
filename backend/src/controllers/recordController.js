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

export const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = {
      user: req.user.id,
    };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const records = await Record.find(filter).sort({ date: -1 });

    res.status(200).json({
      count: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};