import mongoose from "mongoose";
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

export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this record" });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: "Record updated successfully",
      record: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this record" });
    }

    await record.deleteOne();

    res.status(200).json({
      message: "Record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await Record.find({ user: userId });

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategorySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Record.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const formatted = {};
    result.forEach((item) => {
      formatted[item._id] = item.total;
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MONTHLY TRENDS
export const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Record.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Format data
    const trends = {};

    result.forEach((item) => {
      const { year, month, type } = item._id;
      const key = `${year}-${String(month).padStart(2, "0")}`;

      if (!trends[key]) {
        trends[key] = { month: key, income: 0, expense: 0 };
      }

      trends[key][type] = item.total;
    });

    res.status(200).json(Object.values(trends));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};