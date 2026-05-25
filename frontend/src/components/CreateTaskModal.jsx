import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CreateTaskModal({ projectId, onClose, onTaskCreated, fetchMembers }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    deadline: '',
    tags: '',
    alloted_id: user.id //// CHANGE THIS LATER
  });
  const [members, setMembers] = useState([])

  useEffect(() => {
    const loadMembers = () => {
      fetchMembers(projectId, setMembers)
      // console.log("HAHAHAH", members)
    }
    loadMembers()
  }, [projectId])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const taskData = {
        project_id: projectId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline || null,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        alloted_id: formData.alloted_id,
      };

      const response = await client.post('/create_task/', taskData);
      onTaskCreated(response.data.task);
      setFormData({
        description: '',
        priority: 'MEDIUM',
        deadline: '',
        tags: '',
        alloted_id: null
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl transform transition-all">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Create New Task</h3>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Task Title</label>
            <input
              placeholder="Title"
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Task Description</label>
            <textarea
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Members */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Assign To</label>
              <select
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                name="assignto"
                value={formData.alloted_id}
                onChange={handleChange}
              >
                {members.map((user) => {
                  return (<option key={user.id} value={user.id}>{user.user}</option>)
                }
                )}

              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Deadline</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          {/* <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., design, urgent, client"
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div> */}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
