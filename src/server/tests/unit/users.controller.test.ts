import { signup } from '../../controllers/users';
import User from '../../models/User';
import newUser from '../mock-data/new-user.json';
import existingUser from '../mock-data/existing-user.json';
import mongoose from 'mongoose';
import * as httpMocks from 'node-mocks-http';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.URL || 'no connection string';
const req = httpMocks.createRequest();
const res = httpMocks.createResponse();
req.body = newUser;

beforeAll(async () => {
    try {
        await mongoose.connect(connectionString);
    } catch (e) {
        console.log(e);
        console.log(connectionString);
    }
});

afterEach(async () => {
    await User.deleteOne({ name: newUser.name });
});

describe('signup function', () => {
    it('should create a user', async () => {
        await signup(req, res);
        const savedUser = await User.findOne({ name: newUser.name });
        expect(savedUser?.name).toStrictEqual(newUser.name);
    });

    it('should return userId and token in response', () => {
        expect(JSON.parse(res._getData())).toHaveProperty('userId');
        expect(JSON.parse(res._getData())).toHaveProperty('token');
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return error message if username already exists', async () => {
        req.body = existingUser;
        await signup(req, res);
        const arrayOfTwoResponses = res._getData().split('}{');
        const secondResponse = JSON.parse('{' + arrayOfTwoResponses[1]);
        expect(secondResponse.message).toStrictEqual('Username already exist');
    });
});
