import { Schema, Types, model } from 'mongoose';
import { UserDoc } from '../controllers/lists';

export interface IList {
    name: string,
    user: UserDoc,
    tasks: Types.ObjectId[]
}

const ListSchema = new Schema<IList>({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

export default model<IList>('List', ListSchema);
