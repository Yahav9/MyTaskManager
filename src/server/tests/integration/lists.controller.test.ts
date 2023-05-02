import request from 'supertest';
import app, { connectToDataBase } from '../../app';
import List from '../../models/List';
import newList from '../mock-data/lists/new-list.json';
import existingList from '../mock-data/lists/existing-list.json';
import existingUser from '../mock-data/users/existing-user.json';
import updatedList from '../mock-data/lists/updated-list.json';
import { Server } from 'http';

const URL = '/api/lists/';
let token: string;
let userId: string;
let server: Server;

beforeAll((done) => {
    server = app.listen(4002, async () => {
        await connectToDataBase();
        console.log('Server started');
        done();
    });
});

afterAll((done) => {
    server.close(done);
});

afterEach(async () => {
    await List.deleteOne({ name: newList.name });
});

beforeAll(async () => {
    const response = await request(app)
        .post('/api/users/login')
        .send(existingUser);
    token = response.body.token;
    userId = response.body.userId;
});

describe(URL, () => {
    test('POST ' + URL, async () => {
        const response = await request(app)
            .post(URL + userId)
            .set('Authorization', token)
            .send(newList);

        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name');
    });

    test('GET ' + URL, async () => {
        const response = await request(app)
            .get(URL + userId)
            .set('Authorization', token);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].name).toStrictEqual(existingList.name);
    });

    test('PATCH ' + URL, async () => {
        const firstResponse = await request(app)
            .post(URL + userId)
            .set('Authorization', token)
            .send(newList);
        const listId = firstResponse.body._id;

        const secondResponse = await request(app)
            .patch(URL + listId)
            .set('Authorization', token)
            .send(updatedList);

        expect(secondResponse.body.name).toStrictEqual(updatedList.name);
    });

    test('DELETE ' + URL, async () => {
        const firstResponse = await request(app)
            .post(URL + userId)
            .set('Authorization', token)
            .send(newList);
        const listId = firstResponse.body._id;

        const secondResponse = await request(app)
            .delete(URL + listId)
            .set('Authorization', token);
        expect(secondResponse.body.deletedListId).toStrictEqual(listId);
    });
});
