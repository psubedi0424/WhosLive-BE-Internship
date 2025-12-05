"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bull_1 = require("@nestjs/bull");
const bullboard_1 = require("../src/bullboard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const refreshQueue = app.get((0, bull_1.getQueueToken)('refreshQueue'));
    (0, bullboard_1.setupBullBoard)(app, refreshQueue);
    await app.listen(3000);
    console.log('Server listening on http://localhost:3000');
    console.log('Bull Board available on http://localhost:3000/admin/queues');
}
bootstrap();
//# sourceMappingURL=main.js.map