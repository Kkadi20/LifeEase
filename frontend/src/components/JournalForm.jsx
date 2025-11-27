import { useState, useEffect } from 'react';

const JournalForm = ({ entry, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                title: entry.title,
                content: entry.content
            });
        }
    }, [entry]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Title</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Entry title"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="8"
                    placeholder="Write your thoughts..."
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {entry ? 'Update Entry' : 'Create Entry'}
                </button>
                {entry && (
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

export default JournalForm;
