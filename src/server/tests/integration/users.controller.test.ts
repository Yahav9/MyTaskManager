import request from 'supertest';
import app, { connectToDataBase } from '../../app';
import newUser from '../mock-data/users/new-user.json';
import existingUser from '../mock-data/users/existing-user.json';
import wrongPasswordUser from '../mock-data/users/wrong-password-user.json';
import User from '../../models/User';
import { Server } from 'http';

const URL = '/api/users';

let server: Server;

beforeAll((done) => {
    server = app.listen(4001, async () => {
        await connectToDataBase();
        console.log('Server started');
        done();
    });
});

afterAll((done) => {
    server.close(done);
});

afterEach(async () => {
    await User.deleteOne({ name: newUser.name });
});

describe(URL + '/signup', () => {
    it('should return a json object that contains user id and token', async () => {
        const response = await request(app)
            .post(URL + '/signup')
            .send(newUser);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error message if username already exists', async () => {
        const response = await request(app)
            .post(URL + '/signup')
            .send(existingUser);
        expect(response.body.message).toStrictEqual('Username already exist');
    });
});

describe(URL + '/login', () => {
    it('should return a json object that contains user id and token', async () => {
        const response = await request(app)
            .post(URL + '/login')
            .send(existingUser);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error message if username is wrong', async () => {
        const response = await request(app)
            .post(URL + '/login')
            .send(newUser);
        expect(response.body.message).toStrictEqual('wrong username');
    });

    it('should return an error message if password is wrong', async () => {
        const response = await request(app)
            .post(URL + '/login')
            .send(wrongPasswordUser);
        expect(response.body.message).toStrictEqual('Incorrect password');
    });
});
