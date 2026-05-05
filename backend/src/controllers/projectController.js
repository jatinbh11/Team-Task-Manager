const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError("Project not found.", 404));
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return next(new AppError("Only project admin can add members.", 403));
    }

    const targetUser = await User.findById(memberId).select("_id");
    if (!targetUser) {
      return next(new AppError("User not found.", 404));
    }

    const targetUserId = targetUser._id.toString();
    const isMember = project.members.some((member) => member.toString() === targetUserId);
    if (!isMember) {
      project.members.push(new mongoose.Types.ObjectId(targetUserId));
      await project.save();
    }

    const updated = await Project.findById(projectId)
      .populate("admin", "name email")
      .populate("members", "name email");
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError("Project not found.", 404));
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return next(new AppError("Only project admin can remove members.", 403));
    }

    const targetUser = await User.findById(memberId).select("_id");
    if (!targetUser) {
      return next(new AppError("User not found.", 404));
    }
    const targetUserId = targetUser._id.toString();

    if (project.admin.toString() === targetUserId) {
      return next(new AppError("Project admin cannot be removed.", 400));
    }

    project.members = project.members.filter((member) => member.toString() !== targetUserId);
    await project.save();

    const updated = await Project.findById(projectId)
      .populate("admin", "name email")
      .populate("members", "name email");
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  addMember,
  removeMember,
};
