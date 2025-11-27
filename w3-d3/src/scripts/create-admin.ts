// src/scripts/create-admin.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

// SQLite-compatible User entity
import { User } from '../user/user.entity';

async function createAdmin() {
    if (process.env.NODE_ENV === 'test') {
        console.log('create-admin skipped during tests');
        return;
    }
    console.log('Starting admin creation...');

    const dataSource = new DataSource({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [User],
        synchronize: true, // This will create tables if they don't exist
    });

    try {
        await dataSource.initialize();
        console.log('Database connected');

        const userRepository = dataSource.getRepository(User);

        // Check if admin already exists
        const existingAdmin = await userRepository.findOne({
            where: { email: 'admin@example.com' }
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const adminUser = userRepository.create({
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        await userRepository.save(adminUser);
        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await dataSource.destroy();
        console.log('Database connection closed');
    }
}

void createAdmin();