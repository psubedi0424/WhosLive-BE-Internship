"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBullBoard = setupBullBoard;
const express_1 = require("@bull-board/express");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const api_1 = require("@bull-board/api");
function setupBullBoard(app, queue) {
    const serverAdapter = new express_1.ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    (0, api_1.createBullBoard)({
        queues: [new bullAdapter_1.BullAdapter(queue)],
        serverAdapter,
    });
    app.use('/admin/queues', serverAdapter.getRouter());
}
//# sourceMappingURL=bullboard.js.map