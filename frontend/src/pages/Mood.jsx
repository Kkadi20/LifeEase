import { useState, useEffect } from 'react';
import { mood as moodAPI } from '../utils/api';
import MoodForm from '../components/MoodForm';

const Mood = () => {
    const [moodList, setMoodList] = useState([]);
    const [editingMood, setEditingMood] = useState(null);
    const [loading, setLoading] = useState(true);

    const moodEmojis = {
        great: '😄',
        good: '😊',
        okay: '😐',
        bad: '😔',
        terrible: '😢'
    };

    useEffect(() => {
        loadMoods();
    }, []);

    const loadMoods = async () => {
        try {
            const data = await moodAPI.getAll();
            setMoodList(data);
        } catch (error) {
            console.error('Failed to load moods:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (moodData) => {
        try {
            await moodAPI.create(moodData);
            loadMoods();
        } catch (error) {
            alert('Failed to log mood: ' + error.message);
        }
    };

    const handleUpdate = async (moodData) => {
        try {
            await moodAPI.update(editingMood._id, moodData);
            setEditingMood(null);
            loadMoods();
        } catch (error) {
            alert('Failed to update mood: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this mood log?')) return;
        
        try {
            await moodAPI.delete(id);
            loadMoods();
        } catch (error) {
            alert('Failed to delete mood: ' + error.message);
        }
    };

    if (loading) {
        return <div className="p-8">Loading mood logs...</div>;
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Mood Tracker</h1>
                <p className="text-gray-600 mt-1">Monitor your emotional well-being</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {editingMood ? 'Edit Mood' : 'Log Your Mood'}
                    </h2>
                    <MoodForm
                        moodEntry={editingMood}
                        onSubmit={editingMood ? handleUpdate : handleCreate}
                        onCancel={() => setEditingMood(null)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Mood History</h2>
                    
                    {moodList.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No mood logs yet. Start tracking!
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {moodList.map(moodEntry => (
                                <div key={moodEntry._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{moodEmojis[moodEntry.mood]}</span>
                                            <span className="font-medium text-gray-800 capitalize">
                                                {moodEntry.mood}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingMood(moodEntry)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(moodEntry._id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">
                                        📅 {new Date(moodEntry.createdAt).toLocaleDateString()}
                                    </p>
                                    
                                    {moodEntry.note && (
                                        <p className="text-sm text-gray-700">{moodEntry.note}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Mood;
