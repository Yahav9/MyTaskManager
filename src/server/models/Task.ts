import { Schema, model } from 'mongoose';
import { ListDoc } from './List';

export interface ITask {
    name: string,
    priority?: string,
    dueDate?: Date,
    responsibility?: string,
    estimatedTimeToCompleteInHours?: number,
    done: boolean,
    list: ListDoc
}

const TaskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    priority: { type: String },
    dueDate: { type: Schema.Types.Date },
    responsibility: { type: String },
    estimatedTimeToCompleteInHours: { type: Number },
    done: { type: Boolean, required: true },
    list: { type: Schema.Types.ObjectId, ref: 'List', required: true }
});

export default model<ITask>('Task', TaskSchema);
