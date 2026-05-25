
export default function TaskCard({ task, isSelected, onSelect }) {
  const priorityColors = {
    LOW: 'bg-green-50 text-green-700 border border-green-200',
    MEDIUM: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    HIGH: 'bg-red-50 text-red-700 border border-red-200',
  };

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    !task.is_completed;

  return (
    <div
      onClick={() => onSelect(task)}
      className={`w-80 cursor-pointer transition-all duration-300 border-2 rounded-xl p-5 ${isSelected
          ? 'border-gray-700 shadow-xl bg-gray-400'
          : 'border-gray-200 shadow-sm hover:shadow-md bg-white'
        }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`px-2 py-0.5 text-xs font-semibold rounded ` + priorityColors[task.priority]}>
          {task.priority}
        </div>
        {isOverdue && (
          <div className="px-2 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">
            OVERDUE
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-bold text-gray-900 line-clamp-2">
          {task.title}
        </h2>
        <p className="text-xs text-gray-600 line-clamp-2">
          {task.description}
        </p>
      </div>

      {task.deadline && (
        <div className="text-xs text-gray-500 mt-3">
          Deadline: {new Date(task.deadline).toLocaleDateString()}
        </div>
      )}

      {task.alloted_to && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Assigned to:</span>
          <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs font-medium flex items-center justify-center uppercase">
            {task.alloted_to.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}
