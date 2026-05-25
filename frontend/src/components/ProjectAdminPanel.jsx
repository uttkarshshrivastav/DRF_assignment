import { useState } from 'react';
import client from '../api/client';
import {useAuth} from '../context/AuthContext';

export default function ProjectAdminPanel({ project, onClose, users, addMemb, refresh}) {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username:user.id,
        stage: project.stage,
        role: 'admin',
        project_id: project.id
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await client.post('/add_member_to_project/', formData);
            console.log(response.data)
            const member = response.data.member
            addMemb(member)
            // onProjectCreated(response.data.project);
            setFormData({ username: '', stage: formData.stage, role:  ''});
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to Add Member');
        } finally {
            setLoading(false);
        }
    };
    const handleSubmitStage = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await client.patch('/update_project_stage/', {
                    'project_id':formData.project_id,
                    'stage': formData.stage
                });
            console.log(response.data)
            // addMemb(member)
            // onProjectCreated(response.data.project);
            setFormData({ username: '', stage: formData.stage, role:  ''});
            refresh()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update stage');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl transform transition-all">
                <div className='flex justify-between'>
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Admin Panel for Project</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                    >
                        ✕
                    </button>

                </div>
                <h2 className="font-bold text-l mb-4 text-gray-900">{project.title}</h2>
                
                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm" role="alert">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 border rounded-md border-gray-300 shadow-2xs p-5">
                    <div className="flex flex-col gap-1.5 ">
                        <label className="text-sm font-semibold text-gray-700">User</label>
                        <select
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        >
                            {users.map((user)=>{
                                return (<option key={user.id} value={user.id}>{user.username}</option>)
                            }
                            )}
                        </select>
                    </div>
                        
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Role</label>
                        <select
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin</option>
                            <option value="project_lead">Project Lead</option>
                            <option value="designer">Designer</option>
                            <option value="writer">Writer</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="client_viewer">Client Viewer</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-1">
                        
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>

                <form onSubmit={handleSubmitStage} className="space-y-4  border rounded-md border-gray-300 shadow-2xs p-5 my-10">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Current Stage</label>
                        <select
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                            name="stage"
                            value={formData.stage}
                            onChange={handleChange}
                        >
                            <option value="initialized">Initialized</option>
                            <option value="draft">Draft</option>
                            <option value="review">Review </option>
                            <option value="revision">Revision </option>
                            <option value="approved">Approved </option>
                            <option value="completed">Completed </option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-1">
                        
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {'Update Stage'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
