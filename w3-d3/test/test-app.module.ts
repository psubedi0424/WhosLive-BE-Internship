// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppModule } from '../src/app.module';
// import { User } from '../src/user/user.entity';


// @Module({
//     imports: [
//         // override DB only for tests
//         TypeOrmModule.forRoot({
//             type: 'sqlite',
//             database: ':memory:',
//             entities: [User],
//             synchronize: true,
//         }),

//         AppModule,
//     ],
// })
// export class TestAppModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';

@Module({
    imports: [
        // single Test DB connection used for everything in the test run
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            synchronize: true,
            autoLoadEntities: true, // important: so repositories auto-register
        }),

        // import only the feature modules you need for the tests
        UsersModule,
        AuthModule,
    ],
})
export class TestAppModule { }