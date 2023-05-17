import { Schema, Types, model, Document } from 'mongoose';
import { TaskDoc } from './Task';
import { UserDoc } from './User';

export interface IList {
    name: string,
    user: UserDoc,
    tasks: Types.Array<TaskDoc>
}

const ListSchema = new Schema<IList>({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', required: true }]
});

export type ListDoc = Document<unknown, unknown, IList> & IList & { _id: Types.ObjectId };

export default model<IList>('List', ListSchema);
