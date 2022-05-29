const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    classId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    studentIds: {
        type: [Schema.Types.ObjectId],
        required: true,
    },
})

module.exports = mongoose.model('Attendance', AttendanceSchema);