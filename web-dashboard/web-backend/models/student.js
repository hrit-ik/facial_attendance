const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    faceEncoding: {
        type: String,
        // required: true,
    },
    profileUrl: {
        type: String,
    },
    classIds: {
        type: [Schema.Types.ObjectId],
        required: true,
    },
})

module.exports = mongoose.model('Student', StudentSchema);