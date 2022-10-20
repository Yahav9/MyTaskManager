import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: { type: String },
    dueDate: { type: String },
    responsibility: { type: String },
    etc: { type: Number }, // "Estimated Time to Complete" (in working hours).
    done: { type: Boolean, required: true },
    list: { type: mongoose.Types.ObjectId, ref: 'List', required: true }
});

export default mongoose.model('Task', TaskSchema);
