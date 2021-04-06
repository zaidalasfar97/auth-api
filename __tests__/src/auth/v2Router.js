'use strict'

process.env.SECRET = "toes";

const supergoose = require('@code-fellows/supergoose');
const bearer = require('../../../src/auth-server/middleware/bearer.js');
const server = require('../../../src/server.js').server;
const request = supergoose(server);


let id;
let token;
const models = {
    food: {
        route: 'food',
        data: {
            name: `orange`,
            calories: '500',
            type: `fruit`,
        },
        update: {
            name: 'mango',
            calories: '1500',
            type: 'fruit',
        },
    },
    clothes: {
        route: 'clothes',
        data: {
            name: 'jeans',
            color: 'blue',
            size: 'meduim',
        },
        update: {
            name: 'dress',
            color: 'blue',
            size: 'meduim',
        },
    },
};
describe('api/v2 check', () => {
    it('should create a user admin and get the token', async () => {
        const response = await request
            .post('/signup')
            .send({ username: 'admin', password: 'password', role: 'admin' });
        const userObject = response.body;
        token = userObject.token;
        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
    });
    Object.keys(models).forEach((modelType) => {
        describe(`${modelType} tests`, () => {
            it('should be able to insert data into the model', async () => {
                let response = await request
                    .post(`/api/v2/${models[modelType].route}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(models[modelType].data);
                id = response.body._id;
                expect(response.status).toEqual(201);
                expect(response.body.name).toEqual(models[modelType].data.name);
            });
            it('should be able to get all data for the model', async () => {
                let response = await request
                    .get(`/api/v2/${models[modelType].route}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body[0].name).toEqual(models[modelType].data.name);
            });
            it('should be able to get doc data by id', async () => {
                let response = await request
                    .get(`/api/v2/${models[modelType].route}/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.name).toEqual(models[modelType].data.name);
            });
            it('should be able to update data in the model', async () => {
                let response = await request
                    .put(`/api/v2/${models[modelType].route}/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(models[modelType].update);
                expect(response.status).toEqual(200);
                expect(response.body.name).toEqual(models[modelType].update.name);
            });
            it('should be able to get doc data by id', async () => {
                let response = await request
                    .delete(`/api/v2/${models[modelType].route}/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
            });
        });
    });
});