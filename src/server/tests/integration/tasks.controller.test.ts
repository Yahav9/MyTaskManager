import request from 'supertest';
import app, { connectToDataBase } from '../../app';
import Task from '../../models/Task';
import newTask from '../mock-data/tasks/new-task.json';
import existingTask from '../mock-data/tasks/existing-task.json';
import existingUser from '../mock-data/users/existing-user.json';
import editedTask from '../mock-data/tasks/edited-task.json';
import { Server } from 'http';

const URL = '/api/tasks/';
const existingListId = '6447b4244bb0d5c8970bc861';
let token: string;
let server: Server;

beforeAll((done) => {
    server = app.listen(4003, async () => {
        await connectToDataBase();
        console.log('Server started');
        done();
    });
});

beforeAll(async () => {
    const response = await request(app)
        .post('/api/users/login')
        .send(existingUser);
    token = response.body.token;
});

afterAll((done) => {
    server.close(done);
});

afterEach(async () => {
    await Task.deleteOne({ name: newTask.name });
    await Task.deleteOne({ name: editedTask.name });
});

describe(URL, () => {
    test('POST ' + URL, async () => {
        const response = await request(app)
            .post(URL + existingListId)
            .set('Authorization', token)
            .send(newTask);

        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toStrictEqual(newTask.name);
    });

    test('GET ' + URL, async () => {
        const response = await request(app)
            .get(URL + existingListId)
            .set('Authorization', token);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].name).toStrictEqual(existingTask.name);
    });

    test('PUT ' + URL, async () => {
        const firstResponse = await request(app)
            .post(URL + existingListId)
            .set('Authorization', token)
            .send(newTask);
        const taskId = firstResponse.body._id;

        const secondResponse = await request(app)
            .put(URL + taskId)
            .set('Authorization', token)
            .send(editedTask);

        expect(secondResponse.body.name).toStrictEqual(editedTask.name);
    });

    test('PATCH ' + URL, async () => {
        const firstResponse = await request(app)
            .post(URL + existingListId)
            .set('Authorization', token)
            .send(newTask);
        const taskId = firstResponse.body._id;
        const notUpdatedTask = firstResponse.body;

        const secondResponse = await request(app)
            .patch(URL + taskId)
            .set('Authorization', token);

        expect(secondResponse.body).toBeInstanceOf(Object);
        expect(secondResponse.body.done).toBe(!notUpdatedTask.done);
    });

    test('DELETE ' + URL, async () => {
        const firstResponse = await request(app)
            .post(URL + existingListId)
            .set('Authorization', token)
            .send(newTask);
        const taskId = firstResponse.body._id;

        const secondResponse = await request(app)
            .delete(URL + taskId)
            .set('Authorization', token);

        expect(secondResponse.body).toBeInstanceOf(Object);
        expect(secondResponse.body.deletedTaskId).toStrictEqual(taskId);
    });
});
