import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function VersionHistory({ project, tasks, onClose }) {
    const { user } = useAuth();
    const [latestTasks, setLatestTasks] = useState(tasks || []);

    useEffect(() => {
        const fetchFreshTasks = async () => {
            try {
                const response = await client.get('/get_tasks/', {
                    params: { project_id: project.id }
                });
                setLatestTasks(response.data.tasks);
            } catch (err) {
                console.error(err);
            }
        };
        if (project?.id) {
            fetchFreshTasks();
        }
    }, [project]);

    const completedTasks = latestTasks.filter(task => task.is_completed);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl transform transition-all">
                <div className='flex justify-between'>
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Version History for Project</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                    >
                        ✕
                    </button>
                </div>

                <div>
                    {completedTasks.length > 0 ? (
                        completedTasks.map((task, index) => (
                            <div key={task.id || index} className="flex items-center gap-3 m-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-100 transition-colors">
                                <span className="flex items-center justify-center w-6 h-6 bg-zinc-200 text-zinc-600 text-xs font-semibold rounded-md shrink-0">
                                    v{index + 1}
                                </span>
                                <p className="text-zinc-800 text-sm font-medium m-0 truncate">
                                    {task.title}
                                </p>
                                <p className="ml-auto text-xs text-zinc-400 font-mono shrink-0">
                                    {task.completed_at ? `${task.completed_at.slice(0, 10)} ${task.completed_at.slice(11, 16)}` : ''}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center mt-4">No versions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}