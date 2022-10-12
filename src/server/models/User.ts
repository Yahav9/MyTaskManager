import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    lists: [{ type: mongoose.Types.ObjectId, ref: 'List' }]
});

export default mongoose.model('User', UserSchema);
