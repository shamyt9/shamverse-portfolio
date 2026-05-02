import { Request, Response } from 'express';
import Skill from '../models/Skill';

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const skill = new Skill(req.body);
    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (skill) {
      Object.assign(skill, req.body);
      const updatedSkill = await skill.save();
      res.json(updatedSkill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (skill) {
      await skill.deleteOne();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
