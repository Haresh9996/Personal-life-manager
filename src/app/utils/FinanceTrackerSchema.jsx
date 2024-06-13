const { default: mongoose } = require("mongoose");

const financeModel = new mongoose.Schema({
    userId: String,
    category: String,
    amount: Number,
    details: String,
    date: { type: Date, default: Date.now },
});

export const financeTrackerSchema = mongoose.models.financeTracker || mongoose.model("financeTracker", financeModel)