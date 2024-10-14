const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema ({
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true
    },
    message: {
        type: Boolean,
        required: true
    }
});

const Email = mongoose.model("email", EmailSchema);

module.exports = Email;