import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosClient.get("/dashboard");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>
        {error && <p className="rounded bg-rose-100 p-3 text-rose-700">{error}</p>}
        {stats && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-sm text-slate-500">Total Tasks</h3>
                <p className="text-3xl font-semibold">{stats.totalTasks}</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-sm text-slate-500">To Do</h3>
                <p className="text-3xl font-semibold">{stats.tasksByStatus["To Do"]}</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-sm text-slate-500">In Progress</h3>
                <p className="text-3xl font-semibold">
                  {stats.tasksByStatus["In Progress"]}
                </p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-sm text-slate-500">Overdue</h3>
                <p className="text-3xl font-semibold text-rose-600">{stats.overdueTasks}</p>
              </div>
            </div>

            <div className="mt-4 rounded bg-white p-4 shadow">
              <h3 className="mb-2 text-lg font-semibold">Tasks Per User</h3>
              <div className="space-y-2">
                {stats.tasksPerUser?.map((entry) => (
                  <div key={entry.userId} className="flex justify-between rounded bg-slate-50 p-2">
                    <span>{entry.userName}</span>
                    <span className="font-semibold">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
