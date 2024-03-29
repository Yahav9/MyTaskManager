import { Schema, model, Types, Document } from 'mongoose';
import { ListDoc } from './List';

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

export type UserDoc = Document<unknown, unknown, IUser> & IUser & { _id: Types.ObjectId };

export default model<IUser>('User', UserSchema);
