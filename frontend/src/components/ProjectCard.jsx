import { useEffect, useState } from "react";

export default function ProjectCard({ project, progress, isSelected, onSelect, fetchMembers }) {
  const [members, setMembers] = useState([])

  useEffect(()=>{
    const loadMembers = ()=>{
      fetchMembers(project.id, setMembers)
      // console.log("HAHAHAH", members)
    }
    loadMembers()
  }, [project.id])

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
          <div className='px-2 py-0.5 text-xs font-semibold rounded bg-gray-50 text-gray-700 border border-gray-200'>
            {project.stage.toUpperCase()}
          </div>
          <span className="text-xs text-gray-700">
            {project.task_count || 0} tasks
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

        <div className=''>
          <span className="text-xs text-gray-700">
            {members?.length || 0} Members
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
