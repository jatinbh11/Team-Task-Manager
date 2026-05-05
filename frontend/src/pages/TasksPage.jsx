import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

const taskStatuses = ["To Do", "In Progress", "Done"];
const priorities = ["Low", "Medium", "High"];

const TasksPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: "",
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          axiosClient.get("/projects"),
          axiosClient.get("/users"),
        ]);
        setProjects(projectsResponse.data);
        setUsers(usersResponse.data);
        if (projectsResponse.data[0]?._id) {
          setSelectedProjectId(projectsResponse.data[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects.");
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedProjectId) return;
      try {
        const { data } = await axiosClient.get(`/tasks/project/${selectedProjectId}`);
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks.");
      }
    };
    loadTasks();
  }, [selectedProjectId]);

  const createTask = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.post(`/tasks/project/${selectedProjectId}`, taskForm);
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignedTo: "",
      });
      const { data } = await axiosClient.get(`/tasks/project/${selectedProjectId}`);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
    }
  };

  const changeTaskStatus = async (taskId, status) => {
    try {
      const isAdmin = selectedProject?.admin?._id === user?.id;
      if (isAdmin) {
        await axiosClient.patch(`/tasks/${taskId}`, { status });
      } else {
        await axiosClient.patch(`/tasks/${taskId}/status`, { status });
      }
      const { data } = await axiosClient.get(`/tasks/project/${selectedProjectId}`);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status.");
    }
  };

  const reassignTask = async (taskId, assignedTo) => {
    try {
      await axiosClient.patch(`/tasks/${taskId}`, { assignedTo });
      const { data } = await axiosClient.get(`/tasks/project/${selectedProjectId}`);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reassign task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      const { data } = await axiosClient.get(`/tasks/project/${selectedProjectId}`);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task.");
    }
  };

  const selectedProject = projects.find((project) => project._id === selectedProjectId);
  const isAdmin = selectedProject?.admin?._id === user?.id;
  const projectMemberIds = new Set((selectedProject?.members || []).map((member) => member._id));
  const assignableUsers = users.filter((optionUser) => projectMemberIds.has(optionUser._id));

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <h2 className="mb-4 text-2xl font-semibold">Tasks</h2>
        {error && <p className="mb-4 rounded bg-rose-100 p-3 text-rose-700">{error}</p>}

        <div className="mb-4">
          <label className="mb-1 block text-sm">Select Project</label>
          <select
            className="rounded border p-2"
            value={selectedProjectId}
            onChange={(event) => setSelectedProjectId(event.target.value)}
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <form onSubmit={createTask} className="mb-6 rounded bg-white p-4 shadow">
            <h3 className="mb-3 text-lg font-medium">Create Task (Admin)</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded border p-2"
                placeholder="Title"
                value={taskForm.title}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
              <input
                className="rounded border p-2"
                placeholder="Description"
                value={taskForm.description}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
              <input
                className="rounded border p-2"
                type="date"
                value={taskForm.dueDate}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))
                }
                required
              />
              <select
                className="rounded border p-2"
                value={taskForm.priority}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, priority: event.target.value }))
                }
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              <select
                className="rounded border p-2"
                value={taskForm.assignedTo}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, assignedTo: event.target.value }))
                }
                required
              >
                <option value="">Assign user</option>
                {assignableUsers.map((optionUser) => (
                  <option key={optionUser._id} value={optionUser._id}>
                    {optionUser.name} ({optionUser.email})
                  </option>
                ))}
              </select>
            </div>
            <button className="mt-3 rounded bg-slate-900 px-4 py-2 text-white" type="submit">
              Create Task
            </button>
          </form>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {taskStatuses.map((status) => (
            <div key={status} className="rounded bg-slate-100 p-3">
              <h3 className="mb-3 font-semibold">{status}</h3>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <article key={task._id} className="rounded bg-white p-3 shadow">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-slate-600">{task.description}</p>
                      <p className="text-xs text-slate-500">Priority: {task.priority}</p>
                      <p className="text-xs text-slate-500">
                        Assigned: {task.assignedTo?.name || "N/A"}
                      </p>
                      <select
                        className="mt-2 w-full rounded border p-1 text-sm"
                        value={task.status}
                        onChange={(event) => changeTaskStatus(task._id, event.target.value)}
                        disabled={!isAdmin && task.assignedTo?._id !== user?.id}
                      >
                        {taskStatuses.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                      {isAdmin && (
                        <>
                          <select
                            className="mt-2 w-full rounded border p-1 text-sm"
                            value={task.assignedTo?._id || ""}
                            onChange={(event) => reassignTask(task._id, event.target.value)}
                          >
                            {assignableUsers.map((optionUser) => (
                              <option key={optionUser._id} value={optionUser._id}>
                                Assign: {optionUser.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteTask(task._id)}
                            className="mt-2 w-full rounded bg-rose-600 px-2 py-1 text-sm text-white"
                          >
                            Delete Task
                          </button>
                        </>
                      )}
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default TasksPage;
