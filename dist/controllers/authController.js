"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const signup = async (req, res) => {
    const { email, password, name } = req.body;
    const existing = await User_1.default.findOne({ email });
    if (existing)
        return res.status(400).json({ message: 'Email exists' });
    const hash = await bcrypt_1.default.hash(password, 10);
    const user = await User_1.default.create({ email, passwordHash: hash, name });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ accessToken: token, user: { id: user._id, email } });
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ message: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ accessToken: token, user: { id: user._id, email } });
};
exports.login = login;
