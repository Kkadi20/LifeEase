import { useState, useEffect } from 'react';
import { tasks as tasksAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
    const [tasksList, setTasksList] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadTasks();
        requestNotificationPermission();
    }, []);

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    };

    const loadTasks = async () => {
        try {
            const data = await tasksAPI.getAll();
            setTasksList(data);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (taskData) => {
        try {
            await tasksAPI.create(taskData);
            toast.success('Task created successfully!');
            loadTasks();
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleUpdate = async (taskData) => {
        try {
            await tasksAPI.update(editingTask._id, taskData);
            setEditingTask(null);
            toast.success('Task updated successfully!');
            loadTasks();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            await tasksAPI.update(task._id, {
                ...task,
                completed: !task.completed
            });
            toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉');
            loadTasks();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await tasksAPI.delete(id);
            toast.success('Task deleted successfully');
            loadTasks();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    if (loading) {
        return <div className="p-8 dark:text-white">Loading tasks...</div>;
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your daily tasks</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        {editingTask ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <TaskForm
                        task={editingTask}
                        onSubmit={editingTask ? handleUpdate : handleCreate}
                        onCancel={() => setEditingTask(null)}
                    />
                </div>

                {/* List Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Tasks</h2>
                    
                    {tasksList.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No tasks yet. Create your first task!
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {tasksList.map(task => (
                                <div key={task._id} className={`border rounded-lg p-4 ${
                                    task.completed 
                                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-start gap-3 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleComplete(task)}
                                                className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <h3 className={`font-medium ${
                                                task.completed 
                                                    ? 'line-through text-gray-500 dark:text-gray-400' 
                                                    : 'text-gray-800 dark:text-white'
                                            }`}>
                                                {task.title}
                                                {task.isRecurring && (
                                                    <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                                        🔁 {task.recurrencePattern}
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingTask(task)}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 ml-8">
                                        <span>📅 {new Date(task.date).toLocaleDateString()}</span>
                                        <span className={`px-2 py-0.5 rounded ${
                                            task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                                            task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                                            'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                        }`}>
                                            {task.priority}
                                        </span>
                                        <span>🏷️ {task.category}</span>
                                    </div>
                                    
                                    {task.notes && (
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-8">{task.notes}</p>
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

export default Tasks;
