import { Schema, Types, model } from 'mongoose';

export interface IList {
    name: string,
    user: Types.ObjectId,
    tasks: Types.ObjectId[]
}

const ListSchema = new Schema<IList>({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

export default model<IList>('List', ListSchema);
