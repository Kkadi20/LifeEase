import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['academic', 'personal', 'wellness', 'work', 'other'],
        default: 'other'
    },
    notes: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    // NEW: Recurring task fields
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrencePattern: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'custom'],
        default: 'none'
    },
    recurrenceInterval: {
        type: Number,
        default: 1 // Every X days/weeks/months
    },
    recurrenceEndDate: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Task', taskSchema);
