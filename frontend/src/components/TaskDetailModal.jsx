import { useState } from 'react';
import client from '../api/client';

export default function TaskDetailModal({ task, onClose }) {
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');
  // const [versions, setVersions] = useState(task.versions || []);
  const [loadingComment, setLoadingComment] = useState(false);
  const [is_completed, setComplete] = useState(task.is_completed);

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    !task.is_completed;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoadingComment(true);
    try {
      const response = await client.post('/tasks/comment/', {
        task_id: task.id,
        text: newComment,
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoadingComment(false);
    }
  };

  const completeTask = async () => {
    try {
      const response = await client.patch('/set_taskcompleted/', {
        task_id: task.id,
      });
      console.log(response.data)
      setComplete(true)
    } catch (error) {
      console.error('Failed to set complete:', error);
    } 
  }

  const priorityColors = {
    LOW: 'bg-green-50 text-green-700 border border-green-200',
    MEDIUM: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    HIGH: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{task.title}</h3>
            <div className="flex gap-2 mt-2">
              <div className={`px-2 py-0.5 text-xs font-semibold rounded ` + priorityColors[task.priority]}>
                {task.priority}
              </div>
              <div className="px-2 py-0.5 text-xs font-medium rounded border border-gray-300 text-gray-600">
                  Alloted to: {task.alloted_to}
                </div>
              {task.deadline && (
                <div className="px-2 py-0.5 text-xs font-medium rounded border border-gray-300 text-gray-600">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
              {isOverdue && (
                <div className="px-2 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">
                  OVERDUE
                </div>
              )}
              {is_completed && (
                <div className="px-2 py-0.5 text-xs font-semibold rounded bg-green-50 text-green-700 border border-green-200">
                  COMPLETE
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-700">{task.description}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3">Version History</h4>
              <div className="space-y-3">
                ///////////// VERSION HISTORY
                {/* {versions && versions.length > 0 ? (
                  versions.map((version, idx) => (
                    <div key={idx} className="border-l-4 border-gray-700 pl-4 py-2">
                      <div className="font-semibold text-sm text-gray-900">{version.version}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(version.created_at).toLocaleString()}
                      </div>
                      {version.attachments && version.attachments.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {version.attachments.map((attachment, aidx) => (
                            <a
                              key={aidx}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-gray-700 underline hover:text-gray-900"
                            >
                              File {aidx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No versions yet</p>
                )} */}
              </div>
            </div>
            {!is_completed &&(
              <div className='mt-10'>
                <button className='btn bg-gray-300 hover:bg-gray-100 text-black' onClick={completeTask}>
                  Complete
                </button>

              </div>

            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <h4 className="font-bold text-gray-900 mb-3">Comments</h4>

            <div className="flex-1 overflow-y-auto mb-3 space-y-3">
              {comments && comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm">
                    <div className="font-semibold text-xs text-gray-800">
                      {comment.author?.username || 'Unknown'}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{comment.text}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No comments yet</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex flex-col gap-2 border-t border-gray-200 pt-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-2.5 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-xs"
                rows="3"
              />
              <button
                type="submit"
                className="w-full py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-900 text-white rounded transition-colors disabled:opacity-50"
                disabled={loadingComment || !newComment.trim()}
              >
                {loadingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        </div>

        
        
      </div>
    </div>
  );
}
