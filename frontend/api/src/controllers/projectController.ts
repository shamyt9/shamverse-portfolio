import { Request, Response } from 'express';
import Project from '../models/Project';

// @desc    Get all projects with filtering and search
// @route   GET /api/projects?category=web&search=portfolio
// @access  Public
export const getProjects = async (req: Request, res: Response) => {
    try {
        const { category, search } = req.query;

        let query: any = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by search term
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search as string, 'i')] } },
            ];
        }

        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response) => {
    try {
        const project = new Project(req.body);
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            Object.assign(project, req.body);
            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
