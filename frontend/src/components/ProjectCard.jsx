
export default function ProjectCard({ project, progress, isSelected, onSelect }) {
  const stageColors = {
    draft: 'badge-info',
    review: 'badge-warning',
    revision: 'badge-secondary',
    approved: 'badge-success',
    completed: 'badge-success',
    archived: 'badge-ghost',
  };


  return (
    <div
      onClick={() => onSelect(project)}
      className={`card cursor-pointer transition-all duration-300 hover:shadow-2xl ${
        isSelected
          ? 'ring-2 ring-gray-800 bg-gray-400 '
          : 'bg-white shadow-md hover:shadow-xl'
      }`}
    >
      <div className="card-body">
        <h2 className="card-title text-lg font-bold text-black">
          {project.title}
        </h2>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className={`badge ${stageColors[project.stage] || 'badge-default'}`}>
            {project.stage.toUpperCase()}
          </div>
          <span className="text-xs text-gray-700">
            {project.tasks?.length || 0} tasks
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-700">Progress</span>
            <span className="text-xs font-bold text-gray-700">{progress}%</span>
          </div>
          <progress
            className="progress progress-gray-600 w-full"
            value={progress}
            max="100"
          ></progress>
        </div>

        {/* Stage breakdown */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-bold text-gray-600">
                {project.tasks?.filter((t) => t.stage === 'TODO').length || 0}
              </div>
              <div className="text-gray-600">To Do</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-bold text-gray-600 text-center">
                {project.tasks?.filter((t) => t.stage === 'IN_PROGRESS').length || 0}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-bold text-gray-600">
                {project.tasks?.filter((t) => t.stage === 'REVIEW').length || 0}
              </div>
              <div className="text-gray-600">Review</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-bold text-gray-600">
                {project.tasks?.filter((t) => t.stage === 'DONE').length || 0}
              </div>
              <div className="text-gray-600">Done</div>
            </div>
          </div>
        </div>

        {/*Members*/}
        <div className=''>
          <span className="text-xs text-gray-700">
            {project.members?.length || 0} Members
          </span>
        </div>

        {/* <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm outline-gray-800">
            View Details
          </button>
        </div> */}
      </div>
    </div>
  );
}
