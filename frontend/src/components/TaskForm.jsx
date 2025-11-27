import { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        priority: 'medium',
        category: 'academic',
        notes: '',
        isRecurring: false,
        recurrencePattern: 'none',
        recurrenceInterval: 1,
        recurrenceEndDate: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                date: task.date.split('T')[0],
                priority: task.priority,
                category: task.category,
                notes: task.notes || '',
                isRecurring: task.isRecurring || false,
                recurrencePattern: task.recurrencePattern || 'none',
                recurrenceInterval: task.recurrenceInterval || 1,
                recurrenceEndDate: task.recurrenceEndDate ? task.recurrenceEndDate.split('T')[0] : ''
            });
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Task title"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="academic">Academic</option>
                        <option value="personal">Personal</option>
                        <option value="wellness">Wellness</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    placeholder="Additional notes..."
                />
            </div>

            {/* Recurring Task Options */}
            <div className="border-t dark:border-gray-600 pt-4">
                <div className="flex items-center gap-2 mb-3">
                    <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            isRecurring: e.target.checked,
                            recurrencePattern: e.target.checked ? 'daily' : 'none'
                        })}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Make this a recurring task
                    </label>
                </div>

                {formData.isRecurring && (
                    <div className="space-y-3 pl-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Repeat Pattern
                                </label>
                                <select
                                    value={formData.recurrencePattern}
                                    onChange={(e) => setFormData({ ...formData, recurrencePattern: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Every X {formData.recurrencePattern === 'daily' ? 'days' : formData.recurrencePattern === 'weekly' ? 'weeks' : 'months'}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={formData.recurrenceInterval}
                                    onChange={(e) => setFormData({ ...formData, recurrenceInterval: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={formData.recurrenceEndDate}
                                onChange={(e) => setFormData({ ...formData, recurrenceEndDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                >
                    {task ? 'Update Task' : 'Create Task'}
                </button>
                {task && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;
