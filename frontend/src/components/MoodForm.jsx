import { useState, useEffect } from 'react';

const MoodForm = ({ moodEntry, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        mood: '',
        note: ''
    });

    useEffect(() => {
        if (moodEntry) {
            setFormData({
                mood: moodEntry.mood,
                note: moodEntry.note || ''
            });
        }
    }, [moodEntry]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const moods = [
        { value: 'great', emoji: '😄', label: 'Great' },
        { value: 'good', emoji: '😊', label: 'Good' },
        { value: 'okay', emoji: '😐', label: 'Okay' },
        { value: 'bad', emoji: '😔', label: 'Bad' },
        { value: 'terrible', emoji: '😢', label: 'Terrible' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
                <select
                    required
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="">Select mood...</option>
                    {moods.map(m => (
                        <option key={m.value} value={m.value}>
                            {m.emoji} {m.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="4"
                    placeholder="What's on your mind?"
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {moodEntry ? 'Update Mood' : 'Log Mood'}
                </button>
                {moodEntry && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default MoodForm;
