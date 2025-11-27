import { useState, useEffect } from 'react';
import { journal as journalAPI } from '../utils/api';
import JournalForm from '../components/JournalForm';

const Journal = () => {
    const [journalList, setJournalList] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        try {
            const data = await journalAPI.getAll();
            setJournalList(data);
        } catch (error) {
            console.error('Failed to load journals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (entryData) => {
        try {
            await journalAPI.create(entryData);
            loadJournals();
        } catch (error) {
            alert('Failed to create journal entry: ' + error.message);
        }
    };

    const handleUpdate = async (entryData) => {
        try {
            await journalAPI.update(editingEntry._id, entryData);
            setEditingEntry(null);
            loadJournals();
        } catch (error) {
            alert('Failed to update journal entry: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this journal entry?')) return;
        
        try {
            await journalAPI.delete(id);
            loadJournals();
        } catch (error) {
            alert('Failed to delete journal entry: ' + error.message);
        }
    };

    if (loading) {
        return <div className="p-8">Loading journal entries...</div>;
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Journal</h1>
                <p className="text-gray-600 mt-1">Document your thoughts and experiences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {editingEntry ? 'Edit Entry' : 'New Entry'}
                    </h2>
                    <JournalForm
                        entry={editingEntry}
                        onSubmit={editingEntry ? handleUpdate : handleCreate}
                        onCancel={() => setEditingEntry(null)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Entries</h2>
                    
                    {journalList.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No journal entries yet. Start writing!
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {journalList.map(entry => (
                                <div key={entry._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-gray-800">{entry.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingEntry(entry)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(entry._id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">
                                        📅 {new Date(entry.createdAt).toLocaleDateString()}
                                    </p>
                                    
                                    <p className="text-sm text-gray-700 line-clamp-3">{entry.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journal;
