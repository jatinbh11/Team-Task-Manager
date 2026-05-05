import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import ToastContainer from "../components/ToastContainer";
import { useAuth } from "../context/useAuth";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [memberInput, setMemberInput] = useState({});
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);
  const { user } = useAuth();

  const showToast = (message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axiosClient.get("/projects");
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch projects.");
    }
  };

  useEffect(() => {
    Promise.all([axiosClient.get("/projects"), axiosClient.get("/users")])
      .then(([projectsResponse, usersResponse]) => {
        setProjects(projectsResponse.data);
        setUsers(usersResponse.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Unable to fetch projects.");
      });
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.post("/projects", newProject);
      setNewProject({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
    }
  };

  const updateMember = async (projectId, action) => {
    const memberId = memberInput[projectId];
    if (!memberId) {
      showToast("Please select a member first.", "error");
      return;
    }
    try {
      setError("");
      await axiosClient.patch(`/projects/${projectId}/members/${action}`, { memberId });
      fetchProjects();
      showToast(
        action === "add" ? "Member added successfully." : "Member removed successfully.",
        "success"
      );
    } catch (err) {
      const message = err.response?.data?.message || `Failed to ${action} member.`;
      setError(message);
      showToast(message, "error");
    } finally {
      setMemberInput((prev) => ({ ...prev, [projectId]: "" }));
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <main className="mx-auto max-w-6xl p-4">
        <h2 className="mb-4 text-2xl font-semibold">Projects</h2>
        {error && <p className="mb-4 rounded bg-rose-100 p-3 text-rose-700">{error}</p>}

        <form onSubmit={createProject} className="mb-6 rounded bg-white p-4 shadow">
          <h3 className="mb-3 text-lg font-medium">Create Project</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(event) =>
                setNewProject((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded border p-2"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newProject.description}
              onChange={(event) =>
                setNewProject((prev) => ({ ...prev, description: event.target.value }))
              }
              className="rounded border p-2"
            />
          </div>
          <button className="mt-3 rounded bg-slate-900 px-4 py-2 text-white" type="submit">
            Create
          </button>
        </form>

        <div className="space-y-4">
          {projects.map((project) => (
            <article key={project._id} className="rounded bg-white p-4 shadow">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="mb-2 text-sm text-slate-600">{project.description}</p>
              <p className="mb-2 text-sm">
                Admin: <span className="font-medium">{project.admin?.name}</span>
              </p>
              <p className="mb-2 text-sm">
                Members:{" "}
                {project.members?.map((member) => member.name).join(", ") || "No members"}
              </p>
              {project.admin?._id === user?.id && (
                <div className="flex flex-wrap gap-2">
                  <select
                    value={memberInput[project._id] || ""}
                    onChange={(event) =>
                      setMemberInput((prev) => ({ ...prev, [project._id]: event.target.value }))
                    }
                    className="rounded border p-2 text-sm"
                  >
                    <option value="">Select user</option>
                    {users.map((optionUser) => (
                      <option key={optionUser._id} value={optionUser._id}>
                        {optionUser.name} ({optionUser.email})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => updateMember(project._id, "add")}
                    className="rounded bg-emerald-600 px-3 py-2 text-sm text-white"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMember(project._id, "remove")}
                    className="rounded bg-rose-600 px-3 py-2 text-sm text-white"
                  >
                    Remove Member
                  </button>
                </div>
              )}
              {project.admin?._id !== user?.id && (
                <p className="mt-2 text-xs text-slate-500">Only admin can manage members.</p>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;
