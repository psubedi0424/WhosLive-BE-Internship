import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// import { AppModule } from '../src/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { Server } from 'http';
import { TestAppModule } from './test-app.module';

// Define response types
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface RegisterResponse {
    user: {
        id: number;
        email: string;
    };
    tokens: AuthTokens;
}

interface LoginResponse {
    tokens: AuthTokens;
}

interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

interface AdminSecretResponse {
    ok: boolean;
}

describe('Auth E2E', () => {
    let app: INestApplication;
    let server: Server;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestAppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

        await app.init();

        server = app.getHttpServer() as Server;
        dataSource = app.get(DataSource);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should register, login, refresh token, and access protected route', async () => {
        const email = `user${Date.now()}@test.com`;
        const password = 'password123';

        // 1️⃣ Register
        const registerRes = await request(server)
            .post('/auth/register')
            .send({ email, password })
            .expect(201);

        const registerBody = registerRes.body as RegisterResponse;
        expect(registerBody.tokens).toBeDefined();

        const { accessToken: regAccess, refreshToken: regRefresh } = registerBody.tokens;
        expect(regAccess).toBeDefined();
        expect(regRefresh).toBeDefined();

        // 2️⃣ Login
        const loginRes = await request(server)
            .post('/auth/login')
            .send({ email, password })
            .expect(201);

        const loginBody = loginRes.body as LoginResponse;
        const accessToken: string = loginBody.tokens.accessToken;
        const refreshToken: string = loginBody.tokens.refreshToken;

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();

        // 3️⃣ Refresh token
        const refreshRes = await request(server)
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(201);

        const refreshBody = refreshRes.body as RefreshResponse;
        const newAccess: string = refreshBody.accessToken;
        const newRefresh: string = refreshBody.refreshToken;

        expect(newAccess).toBeDefined();
        expect(newRefresh).toBeDefined();
        expect(newRefresh).not.toEqual(refreshToken); // refresh rotation works

        // 4️⃣ Access a protected route (normal user)
        await request(server)
            .get('/admin/secret')
            .set('Authorization', `Bearer ${newAccess}`)
            .expect(403); // user is not admin
    });

    it('should allow an admin user to access admin protected route', async () => {
        // Create admin manually
        const adminEmail = `admin${Date.now()}@test.com`;
        const adminPass = 'adminpass123';

        // Register admin
        const regAdmin = await request(server)
            .post('/auth/register')
            .send({ email: adminEmail, password: adminPass })
            .expect(201);

        const regAdminBody = regAdmin.body as RegisterResponse;
        const adminId: number = regAdminBody.user.id;

        // Promote to admin in DB
        await dataSource
            .createQueryBuilder()
            .update('user')
            .set({ role: 'admin' })
            .where('id = :id', { id: adminId })
            .execute();

        // Login admin
        const loginAdmin = await request(server)
            .post('/auth/login')
            .send({ email: adminEmail, password: adminPass })
            .expect(201);

        const loginAdminBody = loginAdmin.body as LoginResponse;
        const adminAccess: string = loginAdminBody.tokens.accessToken;

        // Access admin route
        const res = await request(server)
            .get('/admin/secret')
            .set('Authorization', `Bearer ${adminAccess}`)
            .expect(200);

        const resBody = res.body as AdminSecretResponse;
        expect(resBody.ok).toBe(true);
    });
});