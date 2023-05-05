import { Schema, Types, model } from 'mongoose';

export interface IUser {
    name: string,
    password: string,
    lists: Types.ObjectId[]
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }]
});

export default model<IUser>('User', UserSchema);
