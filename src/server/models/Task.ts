import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: { type: String },
    dueDate: { type: Date },
    responsibility: { String },
    etc: { type: Number }, // "Estimated Time to Complete" (in working hours).
    list: { type: mongoose.Types.ObjectId, ref: 'List', required: true }
});

export default mongoose.model('User', TaskSchema);
