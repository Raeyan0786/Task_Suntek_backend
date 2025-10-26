"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const tasksController_1 = require("../controllers/tasksController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get('/', tasksController_1.getTasks);
router.post('/', tasksController_1.createTask);
router.put('/:id', tasksController_1.updateTask);
router.delete('/:id', tasksController_1.deleteTask);
exports.default = router;
