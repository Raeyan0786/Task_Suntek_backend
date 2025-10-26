import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'Pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeLog' }],
  isActive: { type: Boolean, default: false }, // Add this field
  activeLog: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeLog' } // Add this field
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);