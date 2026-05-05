const Project = require("../models/Project");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");

const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError("Project not found.", 404));
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return next(new AppError("Only project admin can create or assign tasks.", 403));
    }

    const isProjectMember = project.members.some(
      (member) => member.toString() === assignedTo
    );
    if (!isProjectMember) {
      return next(new AppError("Assigned user must be a project member.", 400));
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      project: projectId,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError("Project not found.", 404));
    }

    const isMember = project.members.some(
      (member) => member.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return next(new AppError("Not allowed to view this project's tasks.", 403));
    }

    const isAdmin = project.admin.toString() === req.user._id.toString();
    const taskFilter = isAdmin ? { project: projectId } : { project: projectId, assignedTo: req.user._id };

    const tasks = await Task.find(taskFilter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
      return next(new AppError("Task not found.", 404));
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return next(new AppError("You can update only your assigned tasks.", 403));
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const updateTaskByAdmin = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return next(new AppError("Task not found.", 404));
    }

    const project = await Project.findById(task.project);
    if (!project || project.admin.toString() !== req.user._id.toString()) {
      return next(new AppError("Only project admin can edit tasks.", 403));
    }

    if (req.body.assignedTo) {
      const isProjectMember = project.members.some(
        (member) => member.toString() === req.body.assignedTo
      );
      if (!isProjectMember) {
        return next(new AppError("Assigned user must be a project member.", 400));
      }
    }

    const allowedFields = ["title", "description", "dueDate", "priority", "status", "assignedTo"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });
    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("project", "name");
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTaskByAdmin = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return next(new AppError("Task not found.", 404));
    }

    const project = await Project.findById(task.project);
    if (!project || project.admin.toString() !== req.user._id.toString()) {
      return next(new AppError("Only project admin can delete tasks.", 403));
    }

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  updateTaskByAdmin,
  deleteTaskByAdmin,
};
