import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }]
});

export default mongoose.model('List', ListSchema);
