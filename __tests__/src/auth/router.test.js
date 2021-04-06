'use strict';

process.env.SECRET = "toes";

const server = require('../../../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../../../src/auth-server/middleware/bearer');
const mockRequest = supergoose(server);

let users = {
    admin: { username: 'admin', password: 'password', role: 'admin' },
    editor: { username: 'editor', password: 'password', role: 'editor' },
    user: { username: 'user', password: 'password', role: 'user' },
};

describe('Auth Router check', () => {
    Object.keys(users).forEach((userType) => {
        describe(`${userType} users`, () => {
            it('should create user', async () => {
                const response = await mockRequest
                    .post('/signup')
                    .send(users[userType]);
                const userObject = response.body;
                expect(response.status).toBe(201);
                expect(userObject.token).toBeDefined();
                expect(userObject.user._id).toBeDefined();
                expect(userObject.user.username).toEqual(users[userType].username);
            });

            it('should sigin', async () => {
                const response = await mockRequest
                    .post('/signin')
                    .auth(users[userType].username, users[userType].password);

                const userObject = response.body;
                expect(response.status).toBe(200);
                expect(userObject.token).toBeDefined();
                expect(userObject.user._id).toBeDefined();
                expect(userObject.user.username).toEqual(users[userType].username);
            });

            it('should signin with bearer', async () => {
                const response = await mockRequest
                    .post('/signin')
                    .auth(users[userType].username, users[userType].password);
                const token = response.body.token;
                const bearerResponse = await mockRequest
                    .get('/secret')
                    .set('Authorization', `Bearer ${token}`);

                expect(bearerResponse.status).toBe(200);
            });
        });

        describe('should check if bad logins', () => {
            it('basic fails with known user and wrong password ', async () => {
                const response = await mockRequest.post('/signin').auth('admin', 'xyz');
                const userObject = response.body;

                expect(response.status).toBe(403);
                expect(userObject.user).not.toBeDefined();
                expect(userObject.token).not.toBeDefined();
            });

            it(' should check basic fails with unknown user', async () => {
                const response = await mockRequest
                    .post('/signin')
                    .auth('nobody', 'xyz');
                const userObject = response.body;

                expect(response.status).toBe(403);
                expect(userObject.user).not.toBeDefined();
                expect(userObject.token).not.toBeDefined();
            });

            it(' should ckeck bearer fails with an invalid token', async () => { 
                const bearerResponse = await mockRequest
                    .get('/users')
                    .set('Authorization', `Bearer foobar`);   
                expect(bearerResponse.status).toBe(403);
            });
        });
    });
});