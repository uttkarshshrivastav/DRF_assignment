import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  useEffect(()=>{
    if (!isAuthenticated){
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id);
    }
  }, [selectedProject]);  
  
  const toggleSelectedProject = (project) => {
    if (selectedProject === project){
      setSelectedProject(null)
    }else{
      setSelectedProject(project)
    }
  }
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await client.get('/get_all_projects/');
      console.log(response.data.projects, user)
      setProjects(response.data.projects);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setShowProjectModal(false);
    setSelectedProject(newProject)
  };

  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (t) => t.stage === 'DONE'
    ).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  const fetchTasks = async (projectId) => {
    try {
      const response = await client.get('/get_tasks/', {
        params: { project_id: projectId },
      });
      setTasks(response.data.tasks);
      console.log(tasks)
      if (response.data.length > 0) {
        setSelectedTask(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    }
  };
  
  const handleTaskCreated = (newTask) => {
    console.log(tasks)
    setTasks([...tasks, newTask]);
    console.log(tasks)
    setShowTaskModal(false);
  };
  
  
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-200">
        <div className="bg-gray-500 text-white p-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Super Studios Project Manager</h1>
            <p className="text-indigo-100">Welcome, {user?.alias}!</p>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto mt-4 p-4">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mx-auto p-8 flex flex-row justify-content gap-10">
          <div className="mb-12 flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Your Projects</h2>
              </div>
              <button
                onClick={() => setShowProjectModal(true)}
                className="btn text-white gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                New Project
              </button>
            </div>

            {loading && (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}

            {!loading && projects.length === 0 ? (
              <div className="card bg-white shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No projects yet</p>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="btn gap-2 mx-auto"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    progress={calculateProgress(project)}
                    isSelected={selectedProject?.id === project.id}
                    onSelect={toggleSelectedProject}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedProject && (
            <>
            <div className="h-screen w-px bg-gray-400">

            </div>
            <div className="mb-12 flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Project Tasks: {selectedProject.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} in this project
                  </p>
                </div>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="btn gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="card bg-white shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    No tasks yet. Create one to get started!
                  </p>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="btn gap-2 mx-auto"
                  >
                    Create Your First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <TaskList
                    tasks={tasks}
                    selectedTask={selectedTask}
                    onSelectTask={setSelectedTask}
                  />
                </div>
              )}
            </div>
            </>
          )}

          

        {showProjectModal && (
          <CreateProjectModal
            onClose={() => setShowProjectModal(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}

        {showTaskModal && (
          <CreateTaskModal
            projectId={selectedProject?.id}
            onClose={() => setShowTaskModal(false)}
            onTaskCreated={handleTaskCreated}
          />
        )}

        </div>
      </div>
    </Layout>
  );
}
