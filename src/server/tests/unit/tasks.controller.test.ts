import { login } from '../../controllers/users';
import { createTask } from '../../controllers/tasks';
import Task from '../../models/Task';
import newTask from '../mock-data/tasks/new-task.json';
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
    req.params.listId = '6447b4244bb0d5c8970bc861'; // existing list id
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
    await Task.deleteOne({ name: newTask.name });
    await Task.deleteOne({ name: 'updated name' });
});

describe('createTask function', () => {
    it('should create a task and post it on DB', async () => {
        req.body = newTask;
        await createTask(req, res);
        const savedTask = await Task.findOne({ name: newTask.name });
        expect(savedTask?.name).toStrictEqual(newTask.name);
    });

    it('should return task in response', async () => {
        req.body = newTask;
        await createTask(req, res);
        expect(res._getJSONData().name).toStrictEqual(newTask.name);
    });

    it('should return an error message if token is incorrect', async () => {
        req.body = newTask;
        req.userId = 'incorrect token';
        await createTask(req, res);
        expect(res._getJSONData().message).toStrictEqual('Authentication failed');
    });
});
