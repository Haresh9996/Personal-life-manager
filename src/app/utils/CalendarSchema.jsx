const { default: mongoose } = require("mongoose");

const eventModel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    date: { type: String, required: true },
    events: { type: [String], required: true },
});

export const eventSchema = mongoose.models.events || mongoose.model("events", eventModel);
