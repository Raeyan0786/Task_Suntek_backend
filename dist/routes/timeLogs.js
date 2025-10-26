"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const timeLogsController_1 = require("../controllers/timeLogsController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.post('/start', timeLogsController_1.startTimer);
router.post('/stop', timeLogsController_1.stopTimer);
exports.default = router;
