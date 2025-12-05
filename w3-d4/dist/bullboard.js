"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBullBoard = setupBullBoard;
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const express_1 = require("@bull-board/express");
function setupBullBoard(queues) {
    const serverAdapter = new express_1.ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    (0, api_1.createBullBoard)({
        queues: queues.map((q) => new bullMQAdapter_1.BullMQAdapter(q)),
        serverAdapter: serverAdapter,
    });
    return serverAdapter;
}
//# sourceMappingURL=bullboard.js.map