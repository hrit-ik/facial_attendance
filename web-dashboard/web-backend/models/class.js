const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    timing: {
        type: [],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    classCode: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Class', ClassSchema);