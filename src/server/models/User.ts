import { Schema, model, Types } from 'mongoose';
import { ListDoc } from '../controllers/lists';

export interface IUser {
    name: string,
    password: string,
    lists: Types.Array<ListDoc>
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    lists: [{ type: Schema.Types.ObjectId, ref: 'List', required: true }]
});

export default model<IUser>('User', UserSchema);
