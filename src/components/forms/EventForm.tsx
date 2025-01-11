import { useState } from 'react';

const EventForm = ({ handleAddEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input fields
    if (!title || !start || !end) {
      alert('Please fill in all fields.');
      return;
    }

    // Create a new event object
    const newEvent = {
      id: Date.now(), // Unique ID for the event
      title,
      start: new Date(start),
      end: new Date(end),
    };

    // Add the new event to the calendar
    handleAddEvent(newEvent);

    // Clear the form fields
    setTitle('');
    setStart('');
    setEnd('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Event Title"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
            >
              Add Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;