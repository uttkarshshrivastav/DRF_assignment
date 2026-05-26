import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import { useNavigate } from 'react-router-dom';
import TaskDetailModal from '../components/TaskDetailModal';
import ProjectAdminPanel from '../components/ProjectAdminPanel';
import VersionHistory from '../components/VersionHistory';

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
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showVersionHis, setShowVersionHis] = useState(false);
  const [users, setUsers] = useState([]);
  const [currProjMembers, setCurrProjMembers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const get_users = async () => {
      try {
        const response = await client.get('/get_all_users/');
        setUsers(response.data.users);
      } catch (err) {
        return null;
      }
    };
    get_users();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id);
    }
  }, [selectedProject]);

  const toggleSelectedProject = (project) => {
    if (selectedProject === project) {
      setCurrProjMembers([]);
      setSelectedProject(null);
    } else {
      fetchMembers(project.id, setCurrProjMembers);
      setSelectedProject(project);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await client.get('/get_all_projects/');
      setProjects(response.data.projects);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setShowProjectModal(false);
    setSelectedProject(newProject);
  };

  const calculateProgress = (project) => {
    const stageWeights = {
      'initialized': 0,
      'draft': 20,
      'review': 40,
      'revision': 60,
      'approved': 80,
      'completed': 100
    };
    return stageWeights[project.stage];
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await client.get('/get_tasks/', {
        params: { project_id: projectId },
      });
      setTasks(response.data.tasks);
      if (response.data.length > 0) {
        setSelectedTask(response.data[0]);
      }
    } catch (err) {
      setTasks([]);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
  };

  const fetchMembers = async (projectId, setfn) => {
    try {
      const response = await client.get('/get_all_members/', {
        params: { project_id: projectId },
      });
      setfn(response.data.members);
    } catch (err) {
      return null;
    }
  };

  const addMemb = (member) => {
    setCurrProjMembers([...currProjMembers, member]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-200">
        <div className="bg-gray-500 text-white p-8 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Super Studios Project Manager</h1>
              <p className="text-indigo-100">Welcome, {user?.alias}!</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/notifications')}
                className="btn gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                Notifications
              </button>
            </div>
            
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

          <div className="mx-auto p-8 flex flex-row justify-content gap-10 w-screen">
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
                      fetchMembers={fetchMembers}
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
                      <p className="text-gray-600 mt-1">
                        {currProjMembers.length} member{currProjMembers.length !== 1 ? 's' : ''} : {currProjMembers.map(memb => memb.user).join(', ')}
                      </p>
                    </div>
                    <div>
                      
                      <button
                        onClick={() => navigate(`/project/${selectedProject.id}/chat`)}
                        className="btn gap-2 mr-5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                        Project Chat
                      </button>

                      <button
                        onClick={() => setShowVersionHis(true)}
                        className="btn gap-2 mr-5"
                      >
                        Version History
                      </button> 
                      {user.is_admin &&(
                        <button
                        onClick={() => setShowAdminPanel(true)}
                        className="btn gap-2 mr-5"
                      >
                        Admin Panel
                      </button>  
                      )}
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
            {selectedTask && (
              <TaskDetailModal
                task={selectedTask}
                onClose={() => { setSelectedTask(null) }}
              />
            )}
          </div>


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
              fetchMembers={fetchMembers}
            />
          )}

          {showAdminPanel && (
            <ProjectAdminPanel
              project={selectedProject}
              onClose={() => setShowAdminPanel(false)}
              users={users}
              addMemb={addMemb}
              refresh={fetchProjects}
            />
          )}
          
          {showVersionHis && (
            <VersionHistory
              project={selectedProject}
              onClose={() => setShowVersionHis(false)}
              tasks={tasks}
            />
          )}


        </div>
      </div>
    </Layout>
  );
}