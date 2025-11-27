import { useState, useEffect } from 'react';
import { events as eventsAPI } from '../utils/api';
import EventForm from '../components/EventForm';

const Events = () => {
    const [eventsList, setEventsList] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await eventsAPI.getAll();
            setEventsList(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (eventData) => {
        try {
            await eventsAPI.create(eventData);
            loadEvents();
        } catch (error) {
            alert('Failed to create event: ' + error.message);
        }
    };

    const handleUpdate = async (eventData) => {
        try {
            await eventsAPI.update(editingEvent._id, eventData);
            setEditingEvent(null);
            loadEvents();
        } catch (error) {
            alert('Failed to update event: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await eventsAPI.delete(id);
            loadEvents();
        } catch (error) {
            alert('Failed to delete event: ' + error.message);
        }
    };

    if (loading) {
        return <div className="p-8">Loading events...</div>;
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Events</h1>
                <p className="text-gray-600 mt-1">Track your important dates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </h2>
                    <EventForm
                        event={editingEvent}
                        onSubmit={editingEvent ? handleUpdate : handleCreate}
                        onCancel={() => setEditingEvent(null)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Events</h2>
                    
                    {eventsList.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No events yet. Create your first event!
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {eventsList.map(event => (
                                <div key={event._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingEvent(event)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600">
                                        📅 {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    
                                    {event.notes && (
                                        <p className="mt-2 text-sm text-gray-600">{event.notes}</p>
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

export default Events;
