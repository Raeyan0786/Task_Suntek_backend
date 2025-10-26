"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const summaryController_1 = require("../controllers/summaryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get('/daily', summaryController_1.getDailySummary);
exports.default = router;
