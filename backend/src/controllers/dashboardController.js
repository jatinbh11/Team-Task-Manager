const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res, next) => {
  try {
    const userObjectId = req.user._id.toString();
    const now = new Date();
    const projects = await Project.find({ members: req.user._id }).select("_id");
    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({ project: { $in: projectIds } }).populate(
      "assignedTo",
      "name email"
    );
    const tasksPerUserAgg = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$assignedTo",
          userName: { $first: "$user.name" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          userId: { $toString: "$_id" },
          userName: 1,
          count: 1,
        },
      },
    ]);

    const myTasks = tasks.filter((task) => task.assignedTo?._id?.toString() === userObjectId);
    const myTotalTasks = myTasks.length;
    const myOverdueTasks = myTasks.filter(
      (task) => task.status !== "Done" && new Date(task.dueDate) < now
    ).length;
    const myTasksByStatus = myTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { "To Do": 0, "In Progress": 0, Done: 0 }
    );

    res.status(200).json({
      totalTasks: myTotalTasks,
      tasksByStatus: myTasksByStatus,
      overdueTasks: myOverdueTasks,
      tasksPerUser: tasksPerUserAgg,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
