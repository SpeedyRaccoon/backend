const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema ({
    address: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Array,
        required: true,
    },
});

const Address = mongoose.model("address", AddressSchema);

module.exports = Address;