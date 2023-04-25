import { signup, login } from '../../controllers/users';
import User from '../../models/User';
import newUser from '../mock-data/new-user.json';
import existingUser from '../mock-data/existing-user.json';
import wrongPasswordUser from '../mock-data/wrong-password-user.json';
import mongoose from 'mongoose';
import * as httpMocks from 'node-mocks-http';
import dotenv from 'dotenv';
import e from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
dotenv.config();

const CONNECTION_STRING = process.env.URL || 'no connection string';
let req: httpMocks.MockRequest<e.Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>>;
let res: httpMocks.MockResponse<e.Response<unknown, Record<string, unknown>>>;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

beforeAll(async () => {
    try {
        await mongoose.connect(CONNECTION_STRING);
    } catch (e) {
        console.log(e);
        console.log(CONNECTION_STRING);
    }
});

afterEach(async () => {
    await User.deleteOne({ name: newUser.name });
});

describe('login function', () => {
    it('should create a user', async () => {
        req.body = newUser;
        await signup(req, res);
        const savedUser = await User.findOne({ name: newUser.name });
        expect(savedUser?.name).toStrictEqual(newUser.name);
    });

    it('should return userId and token in response', async () => {
        req.body = newUser;
        await User.deleteOne({ name: newUser.name });
        await signup(req, res);
        expect(res._getJSONData()).toHaveProperty('userId');
        expect(res._getJSONData()).toHaveProperty('token');
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return an error message if username already exists', async () => {
        req.body = existingUser;
        await signup(req, res);
        expect(res._getJSONData().message).toStrictEqual('Username already exist');
    });
});

describe('signup function', () => {
    it('should return userId and token in response', async () => {
        req.body = existingUser;
        await login(req, res);
        expect(res._getJSONData()).toHaveProperty('userId');
        expect(res._getJSONData()).toHaveProperty('token');
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return an error message if username is wrong', async () => {
        req.body = newUser;
        await login(req, res);
        expect(res._getJSONData().message).toStrictEqual('wrong username');
    });

    it('should return an error message if password is wrong', async () => {
        req.body = wrongPasswordUser;
        await login(req, res);
        expect(res._getJSONData().message).toStrictEqual('Incorrect password');
    });
});
