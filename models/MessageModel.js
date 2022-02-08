const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        from_user: { type: String, required: true, trim: true },
        room: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        date_sent: { type: Date, required: true },
    },
    { timeseries: true }
);

const Message = new mongoose.model("Message", MessageSchema);
module.exports = Message;
