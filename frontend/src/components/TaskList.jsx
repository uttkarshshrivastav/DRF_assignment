// import { useEffect } from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, selectedTask, onSelectTask }) {
  // useEffect(()=>{
  //   console.log(tasks)
  // },[tasks])

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card bg-white shadow-md p-8 text-center">
        <p className="text-gray-600">No tasks yet</p>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <div className="pb-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="shrink-0">
              <TaskCard
                task={task}
                isSelected={selectedTask?.id === task.id}
                onSelect={onSelectTask}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
