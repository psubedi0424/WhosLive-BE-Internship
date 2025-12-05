"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bullboard_1 = require("./bullboard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const refreshQueue = app.get('BullQueue_refresh');
    const serverAdapter = (0, bullboard_1.setupBullBoard)([refreshQueue]);
    app.use('/admin/queues', serverAdapter.getRouter());
    await app.listen(3000);
    console.log('Application running on: http://localhost:3000');
    console.log('BullBoard UI: http://localhost:3000/admin/queues');
}
bootstrap();
//# sourceMappingURL=main.js.map