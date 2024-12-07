// tests/server.test.js

import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.mjs'; // Ensure this path is correct
import User from '../models/User.js'; // Ensure this path is correct

describe('Server Routes', () => {
    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.MONGODB_URI);
    });

    beforeEach(async () => {
        // Clear the users collection before each test
        await User.deleteMany({});
    });

    after(async () => {
        // Close the database connection after all tests
        await mongoose.connection.close();
    });

    /**
     * Test 1: POST /auth/register
     * Ensures that a new user can register successfully.
     */
    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ username: 'testuser', password: 'testpassword' })
                .expect(201);

            expect(res.body).to.have.property('message', 'User registered successfully');

            const user = await User.findOne({ username: 'testuser' });
            expect(user).to.exist;
            expect(user.username).to.equal('testuser');
        });

        it('should not register a user with an existing username', async () => {
            // First registration
            await request(app)
                .post('/auth/register')
                .send({ username: 'testuser', password: 'testpassword' })
                .expect(201);

            // Attempt duplicate registration
            const res = await request(app)
                .post('/auth/register')
                .send({ username: 'testuser', password: 'newpassword' })
                .expect(400);

            expect(res.body).to.have.property('message', 'Registration failed');
            expect(res.body).to.have.property('error');
        });
    });

    /**
     * Test 2: POST /auth/login
     * Ensures that a user can log in successfully.
     */
    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // Register a user to log in
            const hashedPassword ='testpassword';
            const user = new User({ username: 'testuser', password: hashedPassword });
            await user.save();
        });

        it('should login an existing user successfully', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ username: 'testuser', password: 'testpassword' })
                .expect(200);

            expect(res.body).to.have.property('message', 'Login successful!');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ username: 'testuser', password: 'wrongpassword' })
                .expect(400);

            expect(res.body).to.have.property('message', 'Invalid username or password.');
        });

        it('should not login non-existent user', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ username: 'nonexistent', password: 'testpassword' })
                .expect(400);

            expect(res.body).to.have.property('message', 'Invalid username or password.');
        });
    });

    /**
     * Test 3: GET /chat without Authentication
     * Ensures that unauthenticated access to /chat redirects to /login.
     */
    describe('GET /chat without Authentication', () => {
        it('should redirect to the main page / when accessing /chat without authentication', async () => {
            const res = await request(app).get('/chat');
            expect(res.status).to.equal(302);
            expect(res.headers.location).to.equal('/'); // Adjust if your redirect path is different
        });
    });

    /**
     * Test 4: GET /status
     * Ensures that the /status endpoint returns a 200 status and correct message.
     */
    describe('GET /status', () => {
        it('should return status OK at /status', async () => {
            const res = await request(app).get('/status').expect(200);

            expect(res.type).to.equal('application/json');
            expect(res.body).to.have.property('status', 'OK');
        });
    });
});
