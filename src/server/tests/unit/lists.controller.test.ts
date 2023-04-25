import { createList } from '../../controllers/lists';
import { login } from '../../controllers/users';
import List from '../../models/List';
import newList from '../mock-data/lists/new-list.json';
import existingList from '../mock-data/lists/existing-list.json';
import existingUser from '../mock-data/users/existing-user.json';
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

beforeEach(async () => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();

    req.body = existingUser;
    await login(req, res);
    const userId = res._getJSONData().userId;

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.params.userId = userId;
    req.userId = userId;
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
    await List.deleteOne({ name: newList.name });
});

describe('createList function', () => {

    it('should create a list and post it on DB', async () => {
        req.body = newList;
        await createList(req, res);
        const savedList = await List.findOne({ name: newList.name });
        expect(savedList?.name).toStrictEqual(newList.name);
    });

    it('should return list\'s name and id in response', async () => {
        req.body = newList;
        await createList(req, res);
        expect(res._getJSONData()).toHaveProperty('_id');
        expect(res._getJSONData()).toHaveProperty('name');
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return an error message if list name alrady exists', async () => {
        req.body = existingList;
        await createList(req, res);
        expect(res._getJSONData().message).toStrictEqual('List name already exist');
    });

    it('should return an error message if user doesn\'t exist', async () => {
        req.body = newList;
        req.params.userId = '41224d776a326fb40f000001'; // wrong userId
        await createList(req, res);
        expect(res._getJSONData().message).toStrictEqual('User does not exist');
    });

    it('should return an error message if token is incorrect', async () => {
        req.body = newList;
        req.userId = 'incorrect token';
        await createList(req, res);
        expect(res._getJSONData().message).toStrictEqual('Authentication failed');
    });
});