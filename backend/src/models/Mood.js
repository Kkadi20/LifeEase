import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'bad', 'terrible'],
        required: true
    },
    note: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Mood', moodSchema);
