"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const swagger_module_1 = require("@nestjs/swagger/dist/swagger-module");
const document_builder_1 = require("@nestjs/swagger/dist/document-builder");
require("dotenv/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
async function bootstrap() {
    console.log('Starting application...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const config = new document_builder_1.DocumentBuilder()
        .setTitle('W3-D1 API')
        .setDescription('NestJS Basics')
        .setVersion('1.0')
        .build();
    const document = swagger_module_1.SwaggerModule.createDocument(app, config);
    swagger_module_1.SwaggerModule.setup('docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map