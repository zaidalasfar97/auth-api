"use strict"

process.env.SECRET = "toes";

const supergoose = require('@code-fellows/supergoose');
const bearer = require('../../../src/auth-server/middleware/bearer.js');
const server = require('../../../src/server.js').server;
const request = supergoose(server);

let id;
const models = {
    food: {
        route: 'food',
        data: {
            name: `apple`,
            calories: '1000',
            type: `FRUIT`,
        },
        update: {
            name: 'orange',
            calories: '500',
            type: 'FRUIT',
        },
    },
    clothes: {
        route: 'clothes',
        data: {
            name: 'T-shirt',
            color: 'blue',
            size: 'large',
        },
        update: {
            name: 'Jeans',
            color: 'blue',
            size: 'large',
        },
    },
};
describe('api/v1 check', () => {
    Object.keys(models).forEach((modelType) => {
        describe(`${modelType} tests`, () => {
            it(' should  be able to insert data into the model', async () => {
                let response = await request
                    .post(`/api/v1/${models[modelType].route}`)
                    .send(models[modelType].data);
                id = response.body._id;
                expect(response.status).toEqual(201);
                expect(response.body.name).toEqual(models[modelType].data.name);
            });
            it('should be able to get all data for the model', async () => {
                let response = await request.get(`/api/v1/${models[modelType].route}`);
                expect(response.status).toEqual(200);
                expect(response.body[0].name).toEqual(models[modelType].data.name);
            });
            it('should be able to get doc data by id', async () => {
                let response = await request.get(
                    `/api/v1/${models[modelType].route}/${id}`
                );
                expect(response.status).toEqual(200);
                expect(response.body.name).toEqual(models[modelType].data.name);
            });
            it('should be able to update data in the model', async () => {
                let response = await request
                    .put(`/api/v1/${models[modelType].route}/${id}`)
                    .send(models[modelType].update);
                expect(response.status).toEqual(200);
                expect(response.body.name).toEqual(models[modelType].update.name);
            });
            it('should be able to delete doc data by id', async () => {
                let response = await request.delete(
                    `/api/v1/${models[modelType].route}/${id}`
                );
                expect(response.status).toEqual(200);
            });
        });
    });
});