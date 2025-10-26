import mongoose from 'mongoose';

const timeLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    stoppedAt: {
      type: Date,
      default: null,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('TimeLog', timeLogSchema);


// import mongoose from 'mongoose';
// const timeLogSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
//   startedAt: { type: Date, required: true },
//   stoppedAt: Date,
//   durationSeconds: Number,
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });
// export default mongoose.model('TimeLog', timeLogSchema);
