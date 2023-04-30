import { login } from '../../controllers/users';
import { createTask, getTasks, editTask, updateTaskStatus, deleteTask } from '../../controllers/tasks';
import Task from '../../models/Task';
import newTask from '../mock-data/tasks/new-task.json';
import existingTask from '../mock-data/tasks/existing-task.json';
import editedTask from '../mock-data/tasks/edited-task.json';
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
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(CONNECTION_STRING);
    } catch (e) {
        console.log(e);
        console.log(CONNECTION_STRING);
    }
});

afterEach(async () => {
    await Task.deleteOne({ name: newTask.name });
    await Task.deleteOne({ name: editedTask.name });
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
        expect(res._getJSONData()).toBeInstanceOf(Object);
        expect(res._getJSONData().name).toStrictEqual(newTask.name);
    });

    it('should return an error message if token is incorrect', async () => {
        req.body = newTask;
        req.userId = 'incorrect token';
        await createTask(req, res);
        expect(res._getJSONData().message).toStrictEqual('Authentication failed');
    });
});

describe('getTasks function', () => {
    it('should return all lists in response', async () => {
        await getTasks(req, res);
        expect(res._getJSONData()).toBeInstanceOf(Array);
        expect(res._getJSONData()[0].name).toStrictEqual(existingTask.name);
    });
});

describe('editTask function', () => {
    it('should edit a task and update it on DB', async () => {
        req.body = newTask;
        await createTask(req, res);
        const taskId: string = res._getJSONData()._id;

        req.body = editedTask;
        req.params.taskId = taskId;
        await editTask(req, res);
        const updatedTask = await Task.findOne({ name: editedTask.name });
        expect(updatedTask).toBeDefined;
        expect(updatedTask?.name).toStrictEqual(editedTask.name);
    });

    it('should return edited task in response', async () => {
        req.body = newTask;
        await createTask(req, res);
        const taskId: string = res._getJSONData()._id;

        req.body = editedTask;
        req.params.taskId = taskId;
        res = httpMocks.createResponse();
        await editTask(req, res);
        expect(res._getJSONData()).toBeInstanceOf(Object);
        expect(res._getJSONData().name).toStrictEqual(editedTask.name);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe('updateTaskStatus function', () => {
    it('should update task status (done or not) on DB', async () => {
        req.body = newTask;
        await createTask(req, res);
        const notUpdatedTask = res._getJSONData();
        const taskId: string = notUpdatedTask._id;

        req.params.taskId = taskId;
        await updateTaskStatus(req, res);
        const updatedStatusTask = await Task.findOne({ name: newTask.name });
        expect(updatedStatusTask?.done).toBe(!notUpdatedTask.done);
    });

    it('should return updated task status (done or not) in response', async () => {
        req.body = newTask;
        await createTask(req, res);
        const notUpdatedTask = res._getJSONData();
        const taskId: string = notUpdatedTask._id;

        req.params.taskId = taskId;
        res = httpMocks.createResponse();
        await updateTaskStatus(req, res);
        expect(res._getJSONData()).toBeInstanceOf(Object);
        expect(res._getJSONData().done).toBe(!notUpdatedTask.done);
    });
});

describe('deleteTask function', () => {
    it('should delete task from "tasks" collection', async () => {
        req.body = newTask;
        await createTask(req, res);
        const taskId: string = res._getJSONData()._id;

        req.params.taskId = taskId;
        await deleteTask(req, res);
        const deletedList = await Task.findById(taskId);
        expect(deletedList).toBeNull();
    });

    it('should return deleted task id in response', async () => {
        req.body = newTask;
        await createTask(req, res);
        const taskId: string = res._getJSONData()._id;

        req.params.taskId = taskId;
        res = httpMocks.createResponse();
        await deleteTask(req, res);
        expect(res._getJSONData()).toBeInstanceOf(Object);
        expect(res._getJSONData().deletedTaskId).toStrictEqual(taskId);
    });
});
